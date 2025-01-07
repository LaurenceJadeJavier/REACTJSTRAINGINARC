import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import defaultLogo from "../../../../assets/images/logo_placeholder.png";
import * as Io5icons from "react-icons/io5";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import fileUpload from "../../../../utils/S3/fileUpload";
import { POST, PUT } from "../../../../services/api";
import { companyStore } from "../../../../utils/zustand/AdminStore/SystemSetting/companyStore";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";

export default function CompanyProfile() {
  const { fetchAllCompany, company } = companyStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setFormValues({
      ...company,
      tempImg: company.logo,
    });
  }, [company]);

  const inputRef = useRef();

  const onChange = (imageList) => {
    const file = imageList.target.files[0];
    setFormValues({
      ...formValues,
      tempImg: URL.createObjectURL(file),
      image: imageList,
    });
  };

  const validate = () => {
    const params = {
      fileContent: formValues?.image,
      apiFunction: apiFunction,
    };
    openConfirmModal({
      modalAction: () => fileUpload({ ...params }),
    });
  };

  const apiFunction = async (s3Image) => {
    loadingHoc(true);
    const params = {
      name: formValues?.name,
      logo: s3Image ?? company.logo,
    };
    return company ? updateAPI(params) : createAPI(params);
  };

  const updateAPI = async (params) => {
    const { status } = await PUT(`/companies/${company?._id}`, params);
    if (status === 201) {
      fetchAllCompany();
      loadingHoc(false);
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
    } else {
      loadingHoc(false);
    }
  };

  const createAPI = async (params) => {
    const { status } = await POST("/companies", params);
    if (status === 201) {
      fetchAllCompany();
      loadingHoc(false);
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
    } else {
      loadingHoc(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <BackButton />
      <div className="flex h-[90vh] w-full flex-col gap-5 rounded-xl bg-white p-7 drop-shadow-xl ">
        <div className="flex flex-col">
          <div className="text-xl font-semibold text-neutralDark">
            Company Profile
          </div>
          <div className="text-sm text-neutralGray">Manage company details</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="group/item relative flex h-44 w-44 rounded-lg border-2 border-dashed border-primaryBlue">
            <img
              src={formValues?.tempImg ? formValues?.tempImg : defaultLogo}
              alt="company_logo"
              className="h-full w-full rounded-lg bg-cover bg-center object-cover"
            />
            <div
              className="group/edit absolute bottom-0  z-40 h-14 w-full  rounded-b-md hover:cursor-pointer group-hover/item:visible  group-hover/item:bg-primaryBlue "
              onClick={() => inputRef.current.click()}
            >
              <div className="group/edit invisible absolute left-0 top-0 z-40 flex  h-full w-full  flex-row items-center justify-center gap-1 text-white group-hover/item:visible">
                <Io5icons.IoAddCircleOutline className="text-lg" />
                <div className="text-sm">Add Image</div>
              </div>
            </div>
          </div>
          <input
            accept="image/*"
            type="file"
            ref={inputRef}
            hidden
            onChange={(imageList) => onChange(imageList)}
          />
          <CustomInput
            label="Company Name"
            value={formValues.name}
            name="name"
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
          <div className="flex w-full justify-end">
            <button
              onClick={() => validate()}
              className="btn btn-info rounded-xl bg-primaryBlue capitalize text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
