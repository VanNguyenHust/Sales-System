// src/hooks/useStoreInfo.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetStoreByIdQuery } from "../store/api";
import { setStoreInfo } from "./storeInfoReducer";

export const useStoreInfo = () => {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetStoreByIdQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setStoreInfo({
          id: data.id,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          countryCode: data.countryCode,
          provinceCode: data.provinceCode,
          maxProduct: data.maxProduct,
          maxLocation: data.maxLocation,
          maxUser: data.maxUser,
        })
      );
    }
  }, [isSuccess, data, dispatch]);
};
