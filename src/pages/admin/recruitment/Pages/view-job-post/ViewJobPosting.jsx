import React, { useEffect, useState } from "react";
import BackButton from "../../../../../components/buttons/back-button/BackButton";
import * as Io5icons from "react-icons/io5";
import { useLocation, useParams } from "react-router-dom";
import { GET } from "../../../../../services/api";

export default function ViewJobPosting() {
  const { id } = useParams();

  const [jobPostingData, setJobPostingData] = useState([]);
  const [staticToCopy, setStaticLink] = useState("--");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    getJobPostingDataAction();
  }, [id]);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const getJobPostingDataAction = async () => {
    try {
      const { status, data } = await GET("/recruitments/" + id);
      return status === 200 && setJobPostingData(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed!");
    }
  };

  const copyStatus = (urlKey) => {
    if (!copySuccess.length)
      return (
        <Io5icons.IoCopyOutline
          className="text-lg text-primaryBlue hover:cursor-pointer"
          onClick={() => copyToClipBoard(urlKey)}
        />
      );
    if (copySuccess === "Copied!")
      return (
        <div className="flex items-center">
          <span className="text-stateGreen">{copySuccess}</span>
          <Io5icons.IoCheckmarkCircleOutline className="text-lg text-stateGreen" />
        </div>
      );
    if (copySuccess === "Failed!")
      return (
        <div className="flex items-center">
          <span className="text-stateRed">{copySuccess}</span>
          <Io5icons.IoAlertCircleOutline className="text-lg text-stateRed" />
        </div>
      );
  };

  const withJobPostingData = () => {
    const linkLayout = () => {
      const { urlKey } = jobPostingData || {};
      return (
        <>
          <div className="text-2xl font-medium text-neutralDark">
            View Job Details
          </div>
          <div className="mt-4 rounded-lg bg-highlight p-2">
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-neutralGray">Link Generated</div>
                <div className="text-neutralDark">{urlKey ?? "--"}</div>
              </div>
              <div className="flex items-center ">{copyStatus(urlKey)}</div>
            </div>
          </div>
        </>
      );
    };

    const mainDetails = () => {
      const {
        title,
        companyInfo,
        location,
        experience,
        work_level,
        job_type,
        salary,
      } = jobPostingData || {};

      return (
        <>
          <div className="mt-20">
            <div className="text-base text-primaryBlue">{title ?? "--"}</div>
            <div className="flex items-center">
              <div className="text-sm">{companyInfo ?? "--"}</div>
              <Io5icons.IoEllipseSharp className="mx-3 text-[8px]" />
              <div className="text-sm">{location ?? "--"}</div>
            </div>
          </div>
          <div className="my-10 grid-cols-4 gap-4 divide-y p-4 md:grid md:divide-x md:divide-y-0 md:border-y">
            <div className="py-2 md:py-0">
              <div className="flex items-center">
                <Io5icons.IoTime className="mr-1  text-primaryBlue" />
                Experience
              </div>
              <div className="flex text-base font-medium">
                {experience ?? "--"}
              </div>
            </div>
            <div>
              <div className="py-2 md:py-0 md:pl-12">
                <div className="flex items-center">
                  <Io5icons.IoPerson className="mr-1  text-primaryBlue" />
                  Work Level
                </div>
                <div className="flex text-base font-medium">
                  {work_level ?? "--"}
                </div>
              </div>
            </div>
            <div>
              <div className="py-2 md:py-0 md:pl-12">
                <div className="flex items-center">
                  <Io5icons.IoBriefcase className="mr-1  text-primaryBlue" />
                  Job Type
                </div>
                <div className="flex text-base font-medium">
                  {job_type ?? "--"}
                </div>
              </div>
            </div>
            <div>
              <div className="py-2 md:py-0 md:pl-12">
                <div className="flex items-center">
                  <Io5icons.IoCash className="mr-1  text-primaryBlue" />
                  Offer Salary
                </div>
                <div className="flex text-base font-medium">
                  {salary ?? "--"}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };

    const jobDetailsDescription = () => {
      const { desc: descriptionDataObject } = jobPostingData || {};
      const convertedStringToJsonData = descriptionDataObject
        ? JSON.parse(descriptionDataObject)
        : {};
      const {
        desc: description,
        qualification,
        responsibilities,
      } = convertedStringToJsonData || {};

      const descList = [
        {
          title: "Job Description",
          paragraph: description ?? "--",
        },
        {
          title: "Responsibilities",
          listItem: responsibilities ?? [],
        },
        {
          title: "Qualifications",
          listItem: qualification ?? [],
        },
      ];

      return (
        <>
          {descList.map((item) => {
            const { title, paragraph, listItem } = item || {};
            return (
              <div className="my-6" key={title}>
                <div className="my-2 text-xl font-medium text-neutralDark">
                  {title}
                </div>
                {paragraph && (
                  <div className="my-2 text-base text-neutralGray">
                    {paragraph}
                  </div>
                )}
                {listItem
                  ? listItem.map((list) => {
                      return (
                        <>
                          <ul class="list-disc pl-6">
                            <li>{list}</li>
                          </ul>
                        </>
                      );
                    })
                  : null}
              </div>
            );
          })}
        </>
      );
    };

    return (
      <div className="mt-2 h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
        {linkLayout()}
        {mainDetails()}
        {jobDetailsDescription()}
      </div>
    );
  };

  return (
    <div>
      <BackButton navigateTo="/admin/recruitment" />
      {withJobPostingData()}
    </div>
  );
}
