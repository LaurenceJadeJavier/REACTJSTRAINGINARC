import React, { useEffect, useState } from "react";
import moment from "moment";
import * as Io5icons from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

import HorizontalLine from "../../../../../components/seperator-line/HorizontalLine";
import { GET } from "../../../../../services/api";
import bgcompany from "../../../../../assets/background_image/bgcompany.jpeg";

export default function ViewCareer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobPostingData, setJobPostingData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    getJobPostingDataAction();
    getCompanyDataAction();
  }, [id]);

  // get API
  const getJobPostingDataAction = async () => {
    try {
      const { status, data } = await GET("/recruitments/" + id);
      return status === 200 && setJobPostingData(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const getCompanyDataAction = async () => {
    await GET("/companies").then(({ data, status }) => {
      if (status === 200) {
        setCompanyData(data[0]);
      }
    });
  };

  function imagesLayout() {
    return (
      <>
        <div className="relative">
          <img
            src={bgcompany}
            alt="Cover.png"
            className="ab h-32 w-full rounded-t-xl object-cover md:h-56"
          />
          <img
            src={companyData?.logo}
            alt="Company.png"
            className="absolute -bottom-10 left-2 w-24 rounded-xl border border-primaryBlue md:w-32"
          />
        </div>
      </>
    );
  }

  function mainDetails() {
    return (
      <>
        <div className="mt-20">
          <div className="text-xl text-primaryBlue">
            {jobPostingData?.title}
          </div>
          <div className="flex items-center">
            <div className="text-sm font-medium">
              {companyData?.name}
            </div>
            <Io5icons.IoEllipseSharp className="mx-3 text-[8px]" />
            <div className="text-sm font-medium">
              {jobPostingData?.location}
            </div>
          </div>
        </div>
        {/* break */}
        <div class="my-10 gap-4 border-y p-4 lg:grid lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <div className="py-2 lg:py-0">
            <div className="flex items-center">
              <Io5icons.IoTime className="mr-1  text-primaryBlue" />
              Experience
            </div>
            <div className="flex text-base font-medium">
              {jobPostingData?.experience}
            </div>
          </div>
          <div>
            <div className="py-2 lg:py-0 lg:pl-12">
              <div className="flex items-center">
                <Io5icons.IoPerson className="mr-1  text-primaryBlue" />
                Work Level
              </div>
              <div className="flex text-base font-medium">
                {jobPostingData?.work_level}
              </div>
            </div>
          </div>
          <div>
            <div className="py-2 lg:py-0 lg:pl-12">
              <div className="flex items-center">
                <Io5icons.IoBriefcase className="mr-1  text-primaryBlue" />
                Job Type
              </div>
              <div className="flex text-base font-medium">
                {jobPostingData?.job_type}
              </div>
            </div>
          </div>
          <div>
            <div className="py-2 lg:py-0 lg:pl-12">
              <div className="flex items-center">
                <Io5icons.IoCash className="mr-1  text-primaryBlue" />
                Offer Salary
              </div>
              <div className="flex text-base font-medium">
                PHP {jobPostingData?.salary} / monthly
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function jobDetailsDescription() {
    const { desc, qualification, responsibilities } = jobPostingData
      ? JSON.parse(jobPostingData?.desc)
      : {};

    const descList = [
      {
        title: "Job Description",
        paragraph: desc,
      },
      {
        title: "Responsibilities",
        listItem: responsibilities,
      },
      {
        title: "Qualifications",
        listItem: qualification,
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
                <div className="my-2 text-base text-neutralDark">
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
  }

  function applyLayout() {
    return (
      <div>
        <div className="flex flex-col items-center justify-center">
          <img
            src="https://media.discordapp.net/attachments/1027820284960575610/1146350620928913448/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg?width=673&height=673"
            alt="Company.png"
            className="w-40 rounded-xl md:w-32"
          />
        </div>
        <div className="flex items-center justify-center px-2">
          <div className="text-sm text-neutralGray">
            Posted {moment(jobPostingData?.createdAt).format("DD MMMM YYYY")}
          </div>
          <Io5icons.IoEllipseSharp className=" mx-3 text-[8px] text-neutralGray" />
          <div className="text-sm text-neutralGray">
            {jobPostingData?.noOfApplicants} Applicants
          </div>
        </div>
        <div className="px-4">
          <HorizontalLine />
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <div className="text-center text-xl font-medium text-neutralDark">
            Are you interested in this job?
          </div>
          <div className="text-center text-base text-neutralDark">
            Click the "Apply Now" button below to submit your resume and cover
            letter.
          </div>
          <div
            className="mt-11 w-full rounded-lg bg-primaryBlue p-4 text-center text-base font-normal text-white hover:cursor-pointer"
            onClick={() => navigate(`/careers/${id}/application-form`)}
          >
            Apply Now
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:grid md:grid-cols-8 md:gap-4">
        <div className="rounded-xl bg-white pb-1 shadow-md md:col-span-5 lg:col-span-6">
          {imagesLayout()}
          <div className="px-2">
            {mainDetails()}
            {jobPostingData?.length !== 0 && jobDetailsDescription()}
          </div>
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <div className="mt-4 rounded-xl bg-white pb-4 shadow-md md:mt-0">
            {applyLayout()}
          </div>
        </div>
      </div>
    </>
  );
}
