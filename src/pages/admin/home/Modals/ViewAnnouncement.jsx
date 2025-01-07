import React from "react";
import ViewModal from "../../../../components/modal/ViewModal";

// Icons
import * as Io5icons from "react-icons/io5";

export const renderViewAnnouncement = () => {
  return (
    <div className="">
      <div className="flex flex-row items-center gap-1">
        <Io5icons.IoCalendarClearOutline className="text-primaryBlue" />
        <span className="text-sm text-primaryBlue">05 August 2023</span>
      </div>
      <div className="mt-6 whitespace-pre text-base text-neutralDark">
        {`We are pleased to announce that the company's annual team-building event
will take place on November 10, 2023 at BGC. This exciting event
promises a day of fun-filled activities, team bonding, and opportunities
to create lasting memories. 
        
Should you have any questions or require
additional information, please reach out to the HR department. 
        
Let's come together to make this year's team-building event an unforgettable
experience! 🎉 
        
Thank you`}
      </div>
    </div>
  );
};

export default function ViewAnnouncement({ openModal, setOpenModal }) {
  const modalProps = {
    title: "Sample Announcement Title",
    body: renderViewAnnouncement(),
    close: {
      name: "Close",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "viewannouncement",
    maxWidth: "max-w-3xl",
  };

  return <ViewModal {...modalProps} />;
}
