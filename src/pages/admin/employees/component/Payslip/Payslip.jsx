import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import * as Io5icons from "react-icons/io5";

// Component
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";

// Zustand Component
import { payrollComponentStore } from "../../../../../utils/zustand/AdminStore/HrSetup/payrollComponent";

const Payslip = ({ formProps, setFormProps }) => {
  const { empPayrollLists } = formProps || {};
  const { payroll_freq_ids, freq_type } = empPayrollLists || {};

  // Global State
  const { payrollCompData } = payrollComponentStore((state) => state, shallow);

  // Filter Selection
  const fitteredPayrollCompData = (type) =>
    payrollCompData.filter((item) => item.type == type);

  const [paySlipObject, setPaySlipObject] = useState();
  const [renderObject, setRenderObject] = useState();
  const [payrollTimeline, setPayrollTimeline] = useState(freq_type);

  useEffect(() => {}, [renderObject, paySlipObject]);
  useEffect(() => {
    setPaySlipSectionData();
  }, [payroll_freq_ids]);
  useEffect(() => {
    setTimelinePaySlipSectionData();
  }, [payrollTimeline]);

  const setPaySlipSectionData = () => {
    const groupBy = (data, key) => {
      return data.reduce((acc, item) => {
        (acc[item[key]] = acc[item[key]] || []).push(item);
        return acc;
      }, {});
    };

    if (payroll_freq_ids) {
      const reassignPaySlipObject = payroll_freq_ids.map((item, index) => {
        const { payroll_cmp_ids } = item || {};

        const compIdObject = payroll_cmp_ids.map((item) => {
          const { payroll_comp_id } = item || {};
          return { ...item, ...payroll_comp_id };
        });

        const reorganizedRawfreqData = Object.entries(
          groupBy(compIdObject, "type"),
        ).map(([title, data], index) => {
          const paySlipObjectTitle = () => {
            switch (title) {
              case "taxable":
                return "TAXABLE ALLOWANCE";
              case "contributions":
                return "CONTRIBUTIONS";
              case "non-taxable":
                return "NON TAXABLE INCOME";
              case "deduction":
                return "DEDUCTION";
            }
          };

          const paySlipSectionObject = {
            key: index,
            title: paySlipObjectTitle(),
            selection: fitteredPayrollCompData(title),
            type: title,
            data,
          };

          return paySlipSectionObject ?? null;
        });

        return {
          ...item,
          key: index,
          sectionData: reorganizedRawfreqData ?? null,
        };
      });

      return setPaySlipObject(reassignPaySlipObject);
    }
  };

  const setTimelinePaySlipSectionData = () => {
    const groupBy = (data, key) => {
      return data.reduce((acc, item) => {
        (acc[item[key]] = acc[item[key]] || []).push(item);
        return acc;
      }, {});
    };

    if (payroll_freq_ids) {
      const reassignPaySlipObject = payroll_freq_ids.map((item, index) => {
        const { payroll_cmp_ids } = item || {};

        const compIdObject = payroll_cmp_ids.map((item) => {
          const { payroll_comp_id } = item || {};
          return { ...item, ...payroll_comp_id };
        });

        const reorganizedRawfreqData = Object.entries(
          groupBy(compIdObject, "type"),
        ).map(([title, data], index) => {
          const paySlipObjectTitle = () => {
            switch (title) {
              case "taxable":
                return "TAXABLE ALLOWANCE";
              case "contributions":
                return "CONTRIBUTIONS";
              case "non-taxable":
                return "NON TAXABLE INCOME";
              case "deduction":
                return "DEDUCTION";
            }
          };

          const paySlipSectionObject = {
            key: index,
            title: paySlipObjectTitle(),
            selection: fitteredPayrollCompData(title),
            type: title,
            data,
          };

          return paySlipSectionObject ?? null;
        });

        return {
          ...item,
          key: index,
          sectionData: reorganizedRawfreqData ?? null,
        };
      });

      return setPaySlipObject(reassignPaySlipObject);
    }
  };

  const payslipDetails = () => {
    return (
      <>
        <div className="flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Payslip Details
          </span>
          <span className="text-sm  text-neutralGray">
            Setup employee’s payslip
          </span>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                onChange={() => alert(2)}
                value={""}
                label="Payslip Type"
                options={[
                  {
                    label: "Select",
                    value: "",
                  },
                ]}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                label="Payroll Frequency"
                value={payrollTimeline}
                onChange={(e) => {
                  const value = e.target.value;
                  return setPayrollTimeline(value);
                }}
                options={[
                  {
                    label: "Monthly",
                    value: "monthly",
                  },
                  {
                    label: "Semi Monthly",
                    value: "semi-monthly",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const payrollFrequency = () => {
    const payrollFrequenctDetails = (item, paySlipSectionIndex) => {
      const { period, sectionData } = item || {};

      const setUpPayslipDetails = () => {
        return (
          <div className="flex flex-col gap-5 py-5">
            <div className="flex flex-col">
              <span className="text-base font-medium text-neutralDark">
                Setup {period ?? null} Payslip
              </span>
              <span className="text-sm  text-neutralGray">
                Start day - End day
              </span>
            </div>
            <div>
              <div className="col-span-1 md:col-span-2">
                <CustomSelect
                  onChange={() => alert(2)}
                  value={period}
                  label="Payslip Type"
                  options={[
                    {
                      label: "Select",
                      value: "",
                    },
                    {
                      label: "First",
                      value: "first",
                    },
                    {
                      label: "Second",
                      value: "second",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        );
      };

      const selectedData = (
        item,
        paySlipTypeIndex,
        paySlipDetailsIndex,
        selection,
      ) => {
        const setDataFromRootData = (replicatedContainer) => {
          const payroll_freq_ids_configured = replicatedContainer.map(
            (paySlipItem, paySlipIndex) => {
              const { period, payroll_period_id } = paySlipItem || {};

              const container = {
                period,
                payroll_period_id: payroll_period_id?._id,
                payroll_cmp_ids: [],
              };

              replicatedContainer[paySlipIndex].sectionData.map((item) => {
                const { data } = item || {};
                return data.map((item) =>
                  container.payroll_cmp_ids.push({ ...item }),
                );
              });

              return container;
            },
          );

          setFormProps((prev) => ({
            ...prev,
            empPayrollLists: {
              ...prev.empPayrollLists,
              payroll_freq_ids: payroll_freq_ids_configured,
            },
          }));
        };

        const removeElement = () => {
          const paySlipData = paySlipObject;
          const elementLength =
            paySlipData[paySlipSectionIndex].sectionData[paySlipTypeIndex].data;
          if (elementLength.length !== 1) {
            paySlipData[paySlipSectionIndex].sectionData[
              paySlipTypeIndex
            ].data.splice(paySlipDetailsIndex, 1);

            setDataFromRootData(paySlipData);
            setPaySlipObject(paySlipData);
            return setRenderObject(Math.floor(Math.random() * 1000));
          }
        };

        const selectionOnChangeElement = async (event) => {
          const paySlipData = paySlipObject;
          const { name, value } = event.target || {};

          const selectedData = await selection.filter(
            (item) => item._id === value,
          );

          if (selectedData) {
            let selectedTable = paySlipData[paySlipSectionIndex];
            let sectionTable = selectedTable?.sectionData[paySlipTypeIndex];
            let rowDetails = sectionTable?.data[paySlipDetailsIndex];

            rowDetails = {
              ...rowDetails,
              payroll_comp_id: selectedData[0],
              [name]: value,
            };

            paySlipData[paySlipSectionIndex].sectionData[paySlipTypeIndex].data[
              paySlipDetailsIndex
            ] = rowDetails;

            setRenderObject(Math.floor(Math.random() * 1000));
            setDataFromRootData(paySlipData);
            setPaySlipObject(paySlipData);
            return setRenderObject(Math.floor(Math.random() * 1000));
          }
        };

        const amountOnChangeElement = (event) => {
          const paySlipData = paySlipObject;
          const { name, value } = event.target || {};

          let selectedTable = paySlipData[paySlipSectionIndex];
          let sectionTable = selectedTable?.sectionData[paySlipTypeIndex];
          let rowDetails = sectionTable?.data[paySlipDetailsIndex];

          rowDetails = {
            ...rowDetails,
            [name]: Number(value),
          };

          paySlipData[paySlipSectionIndex].sectionData[paySlipTypeIndex].data[
            paySlipDetailsIndex
          ] = rowDetails;

          setRenderObject(Math.floor(Math.random() * 1000));
          setDataFromRootData(paySlipData);
          setPaySlipObject(paySlipData);
          return setRenderObject(Math.floor(Math.random() * 1000));
        };

        return (
          <div
            key={paySlipSectionIndex}
            className="flex flex-row justify-between"
          >
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Name</label>
              <div>
                <select
                  name="_id"
                  className="w-40 p-1 shadow-sm"
                  value={item._id}
                  onChange={selectionOnChangeElement}
                >
                  <option disabled={item._id}>Select</option>
                  {selection.map((option) => {
                    return (
                      <option key={option._id} value={option._id}>
                        {option?.description}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Amount</label>
              <input
                name="amount"
                type="number"
                className="p-1 shadow-sm"
                value={item.amount}
                onChange={amountOnChangeElement}
              />
            </div>
            <div className="item-center flex flex-col justify-center">
              {/* <label className="text-sm text-gray-400">Remove</label> */}
              <Io5icons.IoCloseCircleOutline
                className="text-xl text-stateRed"
                onClick={removeElement}
              />
            </div>
          </div>
        );
      };

      const payslipSectionDetails = () => {
        const sectionDetails = (item, paySlipTypeIndex) => {
          const { title, selection, data, type } = item || {};

          return title ? (
            <div key={paySlipTypeIndex} className="flex flex-col gap-5 p-2">
              <div className="text-md bg-gray-50 p-2 font-semibold">
                {title ?? "--"}
              </div>
              <div className="flex flex-col gap-2 px-4">
                <div>
                  {(data ?? []).map((item, paySlipDetailsIndex) =>
                    selectedData(
                      item,
                      paySlipTypeIndex,
                      paySlipDetailsIndex,
                      selection,
                    ),
                  )}
                </div>
                <div
                  className="cursor-pointer font-semibold text-primaryBlue"
                  onClick={() => {
                    const additionalPaySlipObject = paySlipObject;

                    const additionalData = {
                      amount: 0,
                      _id: "",
                      description: "",
                      type,
                    };

                    additionalPaySlipObject[paySlipSectionIndex]?.sectionData[
                      paySlipTypeIndex
                    ]?.data.push(additionalData);

                    setPaySlipObject(additionalPaySlipObject);
                    return setRenderObject(Math.floor(Math.random() * 1000));
                  }}
                >
                  Add New
                </div>
              </div>
            </div>
          ) : null;
        };

        return (sectionData ?? []).map(sectionDetails);
      };

      return (
        <div key={paySlipSectionIndex}>
          {setUpPayslipDetails()}
          {payslipSectionDetails()}
        </div>
      );
    };

    return (paySlipObject ?? []).map(payrollFrequenctDetails);
  };

  return (
    <div>
      {payslipDetails()}
      {payrollFrequency()}
    </div>
  );
};

export default Payslip;
