import axiosInstance from "./axios";

export const getDashboard = async () => {
    const { data } = await axiosInstance.get("/dashboard");
    return data.result;
  };

  // requestBody : "planDate"
export const getPlan = async (params) => {
    const { data } = await axiosInstance.get("/plan", { params });
    return data.result;
  };

  // requestBody : "productId", "planDate", "targetQty"
export const createPlan = async (requestBody) => {
    const { data } = await axiosInstance.post("/plan", requestBody);
    return data.result;
  };

  // requestBody : "status"
export const updatePlanStatus = async (planId, requestBody) => {
    const { data } = await axiosInstance.patch(`/plan/${planId}`, requestBody);
    return data.result;
};

export const resumeHaltedPlan = async (planId, requestBody) => {
    const { data } = await axiosInstance.post(`/plan/${planId}/resume`, requestBody);
    return data.result;
};

  // requestBody : "equipmentId"
export const startPlan = async (planId, requestBody) => {
    const { data } = await axiosInstance.patch(`/plan/${planId}/start`, requestBody);
    return data.result;
  };

export const getAvailableEquipment = async (planId) => {
    const { data } = await axiosInstance.get(`/plan/${planId}/available-equipment`);
    return data.result;
  };

  // requestBody : "planDate"
export const getProduction = async (params) => {
    const { data } = await axiosInstance.get("/production", { params });
    return data.result;
  };

export const endProduction = async (productionId) => {
    const { data } = await axiosInstance.patch(`/production/${productionId}/end`);
    return data.result;
  };

export const getEquipment = async () => {
    const { data } = await axiosInstance.get("/equipment");
    return data.result;
  };

export const getIdleEquipment = async (params) => {
    const { data } = await axiosInstance.get("/idle-equipment", { params });
    return data.result;
  };

export const updateEquipmentStatus = async (equipmentId, requestBody) => {
    const { data } = await axiosInstance.patch(`/equipment/${equipmentId}/status`, requestBody);
    return data.result;
};

export const getEquipmentDetail = async (equipmentId) => {
    const { data } = await axiosInstance.get(`/equipment/${equipmentId}/detail`);
    return data.result;
};

export const getProducts = async () => {
    const { data } = await axiosInstance.get("/product");
    return data.result;
  };
