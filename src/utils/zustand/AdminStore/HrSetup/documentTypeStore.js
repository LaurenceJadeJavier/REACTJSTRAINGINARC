import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/document-types");
  return set({
    documentType: data,
  });
};

const createDocumentType = (set) => ({
  documentType: [],
  fetchAllDocumentType: () => fetchAll(set),
  storeAllDocumentType: (data) =>
    set({
      documentType: data,
    }),
});

export const documentTypeStore = createWithEqualityFn(createDocumentType);
