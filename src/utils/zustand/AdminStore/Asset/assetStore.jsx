import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const assetObject = {
  assetData: [],
  assetManageData: [],
};

const fetchAssetDataAction = async (set) => {
  try {
    const { data, status } = await GET("/assets");
    return status === 200 && set({ assetData: data ?? [] });
  } catch (err) {
    console.error("err", err);
  }
};

const getAssetManageDataAction = async (id, set) => {
  try {
    const { data, status } = await GET("/assets/histories/" + id);
    return status === 200 && set({ assetManageData: data ?? [] });
  } catch (err) {
    console.error("err", err);
  }
};

const createAssetStore = (set) => ({
  ...assetObject,
  fetchAllAsset: () => fetchAssetDataAction(set),
  fetchManageAsset: (id) => getAssetManageDataAction(id, set),
  storeAllAsset: (data) => set({ assetData: data }),
});

export const assetStore = createWithEqualityFn(createAssetStore);
