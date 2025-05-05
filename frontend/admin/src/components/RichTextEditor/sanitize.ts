import DOMPurify from "dompurify";

const SANITIZED_ATTRIBUTE_PREFIX = "data-sanitized-";
const SANITIZED_ATTRIBUTE_REGEX = new RegExp(`^${SANITIZED_ATTRIBUTE_PREFIX}`);
const VALID_ATTRIBUTE_NAME_PATTERN = "([0-9A-Za-zÀ-ÖØ-öø-ÿ._:\\-]+)";
const VALID_TAG_NAME_REGEX = new RegExp("^[a-zA-Z0-9]+$");
const ENCODED_TAG = "a";
const ENCODED_TAG_NAME_ATTRIBUTE = "data-encoded-tag-name";
const ENCODED_TAG_VALUE_ATTRIBUTE = "data-encoded-tag-value";
const ENCODED_ATTR_ATTRIBUTE_PREFIX = "data-encoded-attr-";
const ENCODED_ATTRIBUTE_REGEX = new RegExp("^data-encoded-.+");
const VALID_ENCODED_ATTRIBUTE_NAME_REGEX = new RegExp(
  `^${ENCODED_ATTR_ATTRIBUTE_PREFIX}${VALID_ATTRIBUTE_NAME_PATTERN}$`
);

DOMPurify.removeAllHooks();
DOMPurify.addHook("uponSanitizeElement", (node, { allowedTags, tagName }) => {
  if (allowedTags[tagName] || !VALID_TAG_NAME_REGEX.test(node.tagName)) {
    return;
  }
  const encodedTagNode = encodeTag(node, tagName);
  if (encodedTagNode) {
    if (node.parentNode) {
      node.parentNode.insertBefore(encodedTagNode, node);
    }
    node.innerHTML = "";
  }
});
DOMPurify.addHook("uponSanitizeAttribute", (node, { allowedAttributes, attrName, attrValue }) => {
  const { ownerDocument } = node;
  if (isSanitizedOrEncodedAttribute(attrName)) {
    return;
  }
  const name = attrName.replace(SANITIZED_ATTRIBUTE_REGEX, "");
  if (!(name in allowedAttributes)) {
    if (isValidHtmlAttributeName(name, ownerDocument)) {
      node.setAttribute(`${SANITIZED_ATTRIBUTE_PREFIX}${name}`, attrValue);
      node.removeAttribute(name);
    }
  }
});

function sanitize(content: string, options: DOMPurify.Config = {}): string {
  const config: DOMPurify.Config = {
    ADD_TAGS: ["iframe", "#comment"],
    FORCE_BODY: true,
    USE_PROFILES: {
      svg: true,
      svgFilters: true,
      html: true,
    },
    ALLOW_UNKNOWN_PROTOCOLS: true,
    FORBID_TAGS: [],
    ...options,
  };

  if (!content) {
    return content;
  }

  return DOMPurify.sanitize(content, config) as string;
}

function desanitize(content: string) {
  const doc = new DOMParser().parseFromString(`<body>${content}</body>`, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let currentNode: Node | null = walker.currentNode;
  let next: Node | null = null;
  while (currentNode) {
    next = walker.nextNode();
    visitNode(currentNode as Element);
    desanitizeAttribute(currentNode as Element);
    currentNode = next;
  }
  return doc.body.innerHTML;
}

function visitNode(node: Element) {
  const { tagName, ownerDocument } = node;
  if (!ownerDocument) {
    return;
  }
  const hasEncodedTagName = Array.from(node.attributes).some(({ name }) => ENCODED_TAG_NAME_ATTRIBUTE === name);
  if (!(tagName.toLowerCase() === ENCODED_TAG.toLowerCase()) || !hasEncodedTagName) {
    return;
  }
  const { tag, attributes } = desanitizeNode(node);
  const newNode = document.createElement(tag.name);
  ownerDocument.adoptNode(newNode);
  if (tag.value) {
    newNode.innerHTML = decrypt(tag.value);
  }
  attributes
    .filter(({ name }) => isValidHtmlAttributeName(name, ownerDocument))
    .forEach(({ name, value }) => {
      newNode.setAttribute(name, decrypt(value));
    });
  node.parentElement?.replaceChild(newNode, node);
}

function desanitizeAttribute(node?: Element) {
  if (!node || !hasSomeAttribute(node)) {
    return;
  }
  const { ownerDocument } = node;
  Array.from(node.attributes)
    .filter(({ name }) => isSanitizedAttribute(name))
    .forEach(({ name, value }) => {
      const newName = name.replace(SANITIZED_ATTRIBUTE_PREFIX, "");
      if (isValidHtmlAttributeName(newName, ownerDocument)) {
        node.setAttribute(newName, value);
      }
      node.removeAttribute(name);
    });
}

function hasSomeAttribute(node: Element) {
  return node.attributes.length > 0;
}

function desanitizeNode(node: Element) {
  const tag = {
    name: "",
    value: "",
  };
  const attributes: { name: string; value: string }[] = [];
  toArray(node.attributes).forEach((attr) => {
    if (!attr) {
      return;
    }
    if (attr.name === ENCODED_TAG_NAME_ATTRIBUTE) {
      tag.name = attr.value;
    } else if (attr.name === ENCODED_TAG_VALUE_ATTRIBUTE) {
      tag.value = attr.value;
    } else if (VALID_ENCODED_ATTRIBUTE_NAME_REGEX.test(attr.name)) {
      attributes.push(createAttribute(attr));
    }
  });
  return { tag, attributes };
}

function createAttribute({ name: t, value: n }: Attr) {
  return {
    name: VALID_ENCODED_ATTRIBUTE_NAME_REGEX.exec(t)?.[1]!,
    value: n,
  };
}

function encodeTag({ ownerDocument, innerHTML, attributes }: Element, tagName: string): Element | undefined {
  if (!ownerDocument) {
    return;
  }
  const result = ownerDocument.createElement(ENCODED_TAG);
  result.setAttribute(ENCODED_TAG_NAME_ATTRIBUTE, tagName);
  result.setAttribute(ENCODED_TAG_VALUE_ATTRIBUTE, encrypt(innerHTML));
  Array.from(attributes)
    .filter(({ name }) => isValidHtmlAttributeName(name, ownerDocument))
    .forEach(({ name, value }) => {
      result.setAttribute(`${ENCODED_ATTR_ATTRIBUTE_PREFIX}${name}`, encrypt(value));
    });

  return result;
}

function isValidHtmlAttributeName(name: string, doc: Document) {
  const ele = doc.createElement("div");
  try {
    ele.setAttribute(name, "");
    return true;
  } catch {
    return false;
  }
}

function isSanitizedAttribute(attributeName: string) {
  return SANITIZED_ATTRIBUTE_REGEX.test(attributeName);
}

function isSanitizedOrEncodedAttribute(attributeName: string) {
  return isSanitizedAttribute(attributeName) || ENCODED_ATTRIBUTE_REGEX.test(attributeName);
}

export function encrypt(content: string) {
  const encoded = encodeURIComponent(content);
  try {
    return btoa(encoded);
  } catch {
    return encoded;
  }
}

function decrypt(content: string) {
  try {
    const decoded = atob(content);
    return decodeURIComponent(decoded);
  } catch {
    return content;
  }
}

function toArray(list: NamedNodeMap): (Attr | null)[] {
  const result = [];
  for (let e = 0; e < list.length; ++e) {
    result.push(list.item(e));
  }
  return result;
}

export { desanitize, ENCODED_TAG_NAME_ATTRIBUTE, sanitize, SANITIZED_ATTRIBUTE_PREFIX };
