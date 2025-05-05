import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";

import { handleErrorApi } from "app/utils/error";

import { Link, LinkChange, Linklist, LinklistChange, SubjectLink, SubjectLinkParentInfo } from "../types/linklist";

export const getAllSubjectLinkParentInfo = (linklists: Linklist[], subjectId: number, type: string) => {
  const track = new Set();
  const rs = [] as SubjectLinkParentInfo[];
  for (const linklist of linklists) {
    const subjectLinks = findAllSubjectLink(linklist, subjectId, type);
    for (const subjectLink of subjectLinks) {
      const key = subjectLink.parentLink ? `${linklist.id}:${subjectLink.parentLink.id}` : `${linklist.id}`;
      if (track.has(key)) {
        continue;
      }
      track.add(key);
      rs.push({
        title: subjectLink.parentLink !== null ? subjectLink.parentLink.title ?? "" : linklist.title,
        linklistRootId: linklist.id,
        linkParentId: subjectLink.parentLink?.id,
      });
    }
  }
  return rs;
};

const findAllSubjectLink = (linklist: Linklist, subjectId: number, type: string) => {
  const rs = [] as SubjectLink[];
  const queues = [] as Link[];
  linklist.links.forEach((link) => {
    if (link.subject_id === subjectId && link.type === type) {
      rs.push({
        linklist,
        link,
        parentLink: null,
      });
    }
    if (link.links.length > 0) {
      queues.push(link);
    }
  });
  while (queues.length > 0) {
    const parent = queues[0];
    for (const link of parent.links) {
      if (link.subject_id === subjectId && link.type === type) {
        rs.push({
          linklist,
          link,
          parentLink: parent,
        });
      }
      if (link.links.length > 0) {
        queues.push(link);
      }
    }
    queues.splice(0, 1);
  }
  return rs;
};

export const updateSubjectLink = async (
  request: {
    subjectId: number;
    type: string;
    title: string;
    subjectParents: SubjectLinkParentInfo[];
    linklists: Linklist[];
  },
  trigger: MutationTrigger<any>
) => {
  const { subjectId, type, title, subjectParents, linklists } = request;
  const changes = generateLinklistChanges(linklists, subjectId, type, title, subjectParents);
  if (changes.length > 0) {
    try {
      await Promise.all(
        changes.map(async (change) => {
          await trigger(change).unwrap();
        })
      );
    } catch (e) {
      handleErrorApi(e);
    }
  }
};

export const generateLinklistChanges = (
  linklists: Linklist[],
  subjectId: number,
  type: string,
  title: string,
  subjectParents: SubjectLinkParentInfo[]
) => {
  const rs = [] as LinklistChange[];
  for (const linklist of linklists) {
    const subjectLinks = findAllSubjectLink(linklist, subjectId, type);

    const linkParentToCreate = subjectParents.filter(
      (p) => p.linklistRootId === linklist.id && !subjectLinks.map((l) => l.parentLink?.id).includes(p.linkParentId)
    );
    const subjectLinksToDelete = subjectLinks.filter(
      (l) =>
        !subjectParents
          .filter((p) => p.linklistRootId === linklist.id)
          .map((p) => p.linkParentId)
          .includes(l.parentLink?.id)
    );
    if (linkParentToCreate.length === 0 && subjectLinksToDelete.length === 0) {
      continue;
    }
    const change = {} as LinklistChange;
    change.id = linklist.id;
    change.changes = [];
    let addedId = 0;
    const changes = linkParentToCreate.map((p) => {
      return {
        action: "create",
        title,
        id: --addedId,
        type,
        subject: subjectId.toString(),
        parent_id: p.linkParentId,
        subject_id: subjectId,
      } as LinkChange;
    });
    change.changes = change.changes.concat(changes);
    const queue = [] as (Link | null)[];
    queue.push(null);
    const linkIdToDelete = new Set<number>(subjectLinksToDelete.map((l) => l.link.id));
    while (queue.length !== 0) {
      const parent = queue[0];
      const links = parent !== null ? parent.links : linklist.links;
      for (const link of links) {
        if (linkIdToDelete.has(link.id)) {
          change.changes.push({
            action: "delete",
            id: link.id,
          } as LinkChange);
          continue;
        }
        if (link.links.length > 0) {
          queue.push(link);
        }
      }
      queue.splice(0, 1);
    }
    rs.push(change);
  }
  return rs;
};

export const validateAlias = () => {
  return (input?: string) => {
    if (!input) {
      return;
    }

    const re = /^[a-z0-9_-]+$/;
    if (!re.test(input)) {
      return "Alias chỉ chứa chỉ gồm các kí tự a-z, 0-9 và -";
    }

    return;
  };
};
