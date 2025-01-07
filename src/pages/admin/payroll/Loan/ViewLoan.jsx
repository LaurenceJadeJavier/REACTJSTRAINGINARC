import React, { useEffect, useState } from "react";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { useLoaderData, useLocation } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { GET } from "../../../../services/api";
import moment from "moment";

export default function ViewLoan() {
  const location = useLocation();
  const [loanData, setLoanData] = useState([]);

  useEffect(() => {
    getLoanAPI();
  }, []);

  const getLoanAPI = async () => {
    await GET(`/loans/${location?.state?.id}`).then(({ data, status }) => {
      if (status === 200) {
        setLoanData(data);
      }
      console.log("view:", data);
    });
  };

  const rows = useLoaderData();
  const { accessor } = createColumnHelper();

  const viewLoanTable = () => {
    // Table Column
    const columns = [
      accessor("date", {
        id: "date",
        header: "Date",
        style: "w-[40%]",
        cell: (info) => info.getValue(),
      }),
      accessor("amountpaid", {
        id: "amountpaid",
        header: "Amount Paid",
        style: "w-[40%]",
        cell: (info) => info.getValue(),
      }),
      accessor("remainingamount", {
        id: "remainingamount",
        header: "Remaining Amount",
        style: "w-auto",
        cell: (info) => info.getValue(),
      }),
    ];

    // Table Config
    const tableProps = {
      columns,
      rows: rows,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  const renderContainer = () => {
    const { emp_id, reason, amount, date } = loanData;

    const sampleData = [
      {
        title: "Employee",
        value: emp_id?.fullName,
      },
      {
        title: "Department",
        value: emp_id?.dept_id?.name,
      },
      {
        title: "Loan Amount",
        value: amount,
      },
      {
        title: "Reason",
        value: reason,
      },
      {
        title: "Disbursement Date",
        value: moment(date).format("MMM DD, YYYY"),
      },
    ];

    const loansampleData = [
      {
        total: "90,000.00",
        description: "Total Amount Repaid",
      },
      {
        total: "90,000.00",
        description: "Remaining Amount",
      },
      {
        total: "90,000.00",
        description: "Instalment(s) Remaining",
      },
    ];

    return (
      <div className="mt-6 rounded-2xl bg-white px-4 py-6 shadow-md">
        <span className="text-lg font-medium text-neutralDark">
          {emp_id?.fullName}’s Loan
        </span>
        <div className="py-8">
          {sampleData.map(({ title, value }) => (
            <div
              className="grid grid-cols-12 items-center gap-2 py-1"
              key={title}
            >
              <div className="col-span-2 flex flex-row items-center justify-between">
                <span className="text-base text-neutralGray">{title}</span>
                <span className="text-base text-neutralGray">:</span>
              </div>
              <div className="col-span-10">
                <span className="text-base text-neutralDark">{value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-medium text-neutralDark">
            Loan Repayment Summary
          </span>
          <span className="text-sm font-normal text-neutralGray">
            Monitor the repayment history of the employee's loans
          </span>
        </div>
        <div className="flex flex-row pt-8">
          {loansampleData.map(({ total, description }, index) => (
            <>
              <div className="flex w-full flex-col px-2">
                <span className="text-lg font-medium text-primaryBlue">
                  {total}
                </span>
                <span className="text-xs text-neutralGray">{description}</span>
              </div>
              <div className="mx-4 h-auto border border-[#F4EEF9]" />
            </>
          ))}
          <div className="flex w-full flex-col gap-1 px-2">
            <span className="text-lg font-medium text-primaryBlue">
              90%{" "}
              <span className="text-xs font-normal text-neutralGray">
                completed
              </span>
            </span>
            <progress
              className="progress w-56 bg-[#EBEFF2]"
              value="90"
              max="100"
            ></progress>
          </div>
        </div>
        {viewLoanTable()}
      </div>
    );
  };

  return (
    <div>
      <div className="pl-2">
        <BackButton />
      </div>
      {renderContainer()}
    </div>
  );
}

export const ViewLoanLoader = async () => {
  const rows = [
    {
      date: "August 09, 2023",
      amountpaid: "10,000.00",
      remainingamount: "10,000.00",
      _id: 0,
    },
  ];

  return rows;
};
