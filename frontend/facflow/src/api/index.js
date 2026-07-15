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
    const { data } = await axiosInstance.patch(`/plan/${planId}/status`, requestBody);
    return data.result;
  };

  // requestBody : "equipmentId"
export const startPlan = async (planId, requestBody) => {
    const { data } = await axiosInstance.patch(`/plan/${planId}/start`, requestBody);
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

export const getIdleEquipment = async () => {
    const { data } = await axiosInstance.get("/idle-equipment");
    return data.result;
  };

export const getProducts = async () => {
    const { data } = await axiosInstance.get("/product");
    return data.result;
  };
