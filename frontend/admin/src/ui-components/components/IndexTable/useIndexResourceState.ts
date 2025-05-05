import { useCallback, useState } from "react";

import { Range, SelectionType } from "./types";

type ResourceIDResolver<T extends { [key: string]: unknown }> = (resource: T) => string;

function defaultResourceIDResolver(resource: { [key: string]: any }): string {
  if ("id" in resource) {
    return resource.id;
  }

  throw new Error(
    "Your resource does not directly contain an `id`. Pass a `resourceIDResolver` to `useIndexResourceState`"
  );
}

export function useIndexResourceState<T extends { [key: string]: unknown }>(
  resources: T[],
  {
    selectedResources: initSelectedResources = [],
    resourceIDResolver = defaultResourceIDResolver,
    resourceFilter = undefined,
  }: {
    selectedResources?: string[];
    resourceIDResolver?: ResourceIDResolver<T>;
    resourceFilter?: (value: T) => boolean;
  } = {
    selectedResources: [],
    resourceIDResolver: defaultResourceIDResolver,
    resourceFilter: undefined,
  }
) {
  const [selectedResources, setSelectedResources] = useState(initSelectedResources);
  const [isSelectedAllResources, setIsSelectedAllResources] = useState(false);

  const handleSelectionChange = useCallback(
    (selectionType: SelectionType, isSelecting: boolean, selection?: string | Range) => {
      switch (selectionType) {
        case SelectionType.All:
          setIsSelectedAllResources(isSelecting);
          setSelectedResources(resources.map(resourceIDResolver));
          break;
        case SelectionType.Single:
          setIsSelectedAllResources(false);
          setSelectedResources((newSelectedResources) =>
            isSelecting
              ? [...newSelectedResources, selection as string]
              : newSelectedResources.filter((id) => id !== selection)
          );
          break;
        case SelectionType.Page:
          setIsSelectedAllResources(false);
          if (resourceFilter) {
            const filteredResources = resources.filter(resourceFilter);
            setSelectedResources(
              isSelecting && selectedResources.length < filteredResources.length
                ? filteredResources.map(resourceIDResolver)
                : []
            );
          } else {
            setSelectedResources(isSelecting ? resources.map(resourceIDResolver) : []);
          }
          break;
        case SelectionType.Multi:
          if (!selection) break;
          setIsSelectedAllResources(false);
          setSelectedResources((newSelectedResources) => {
            const ids: string[] = [];
            const filteredResources = resourceFilter ? resources.filter(resourceFilter) : resources;
            for (let i = Number(selection[0]); i <= Number(selection[1]); i++) {
              if (filteredResources.includes(resources[i])) {
                const id = resourceIDResolver(resources[i]);

                if (
                  (isSelecting && !newSelectedResources.includes(id)) ||
                  (!isSelecting && newSelectedResources.includes(id))
                ) {
                  ids.push(id);
                }
              }
            }

            return isSelecting
              ? [...newSelectedResources, ...ids]
              : newSelectedResources.filter((id) => !ids.includes(id));
          });
          break;
      }
    },
    [resourceFilter, resources, resourceIDResolver, selectedResources.length]
  );

  const clearSelection = useCallback(() => {
    setSelectedResources([]);
    setIsSelectedAllResources(false);
  }, []);

  const removeSelectedResources = useCallback(
    (removeResources: string[]) => {
      const selectedResourcesCopy = [...selectedResources];

      const newSelectedResources = selectedResourcesCopy.filter((resource) => !removeResources.includes(resource));

      setSelectedResources(newSelectedResources);
    },
    [selectedResources]
  );

  return {
    allResourcesSelected: isSelectedAllResources,
    selectedResources,
    handleSelectionChange,
    clearSelection,
    removeSelectedResources,
  };
}
