import React, { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import * as Io5icons from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import fileUpload from "../../../../utils/S3/fileUpload";
import { POST, PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { payrollPeriodStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import { payrollComponentStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollComponent";

const useFiltteredDropdown = () => {
  const { payrollCompData } = payrollComponentStore((state) => state, shallow);

  const fitteredPayrollCompData = (type) =>
    payrollCompData.filter((item) => item.type == type);

  const defaultEmpPayrollLists = [
    {
      _id: 1,
      name: "TAXABLE ALLOWANCE",
      optionsList: fitteredPayrollCompData("taxable"),
      items: [
        {
          payroll_comp_id: "",
          amount: 0,
        },
      ],
    },
    {
      _id: 2,
      name: "CONTRIBUTIONS",
      optionsList: fitteredPayrollCompData("contributions"),
      items: [
        {
          payroll_comp_id: "",
          amount: 0,
        },
      ],
    },
    {
      _id: 3,
      name: "NON TAXABLE INCOME",
      optionsList: fitteredPayrollCompData("non-taxable"),
      items: [
        {
          payroll_comp_id: "0",
          amount: 0,
        },
      ],
    },
    {
      _id: 4,
      name: "DEDUCTIONS",
      optionsList: fitteredPayrollCompData("deduction"),
      items: [
        {
          payroll_comp_id: "",
          amount: 0,
        },
      ],
    },
    {
      _id: 5,
      name: "WITHHOLDING TAX",
      optionsList: fitteredPayrollCompData("withholding"),
      items: [
        {
          payroll_comp_id: "",
          amount: 0,
        },
      ],
    },
  ];
  return defaultEmpPayrollLists;
};

const payrollCompDefault = {
  payroll_comp_id: "",
  amount: 0,
};

const payroll_freq_idsDefault = {
  payroll_period_id: "",
  period: "",
  payroll_cmp_ids: [
    {
      ...payrollCompDefault,
    },
  ],
};

const defaultFormVaues = {
  freq_type: "monthly",
  payroll_freq_ids: [{ ...payroll_freq_idsDefault, period: "first" }],
};

export default function PayslipDetails({ setForm }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const defaultEmpPayrollLists = useFiltteredDropdown();

  const {
    openConfirmModal,
    openSuccessModal,
    openDeleteModal,
    openFailedModal,
  } = alertModalStore((state) => state, shallow);
  const { employeeForm, fetchAllEmployee, clearEmployeeForm } = employeeStore(
    (state) => state,
    shallow,
  );

  const { fetchAllPayrollComponent, payrollCompData } = payrollComponentStore(
    (state) => state,
    shallow,
  );

  const { payrollPeriods } = payrollPeriodStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [consolidatedDataTable, setConsolidatedData] = useState([]);

  const [formValues, setFormValues] = useState({
    ...defaultFormVaues,
  });
  console.log(`formValues:`, formValues)

  const forPeriodSelectData = useMemo(() => {
    const newList = [];
    payrollPeriods.map((item) => {
      const formattedVal = {
        label: item.name,
        value: item._id,
      };
      newList.push({ ...formattedVal });
      return newList;
    });
    return newList;
  }, [payrollPeriods]);

  const { freq_type, payroll_freq_ids } = formValues || {};

  const onChangeHandler = (e) => {
    const { value } = e.target || {};
    setFormValues((prev) => {
      return { ...prev, freq_type: value };
    });
  };
  useEffect(() => {
    setConsolidatedData([[...defaultEmpPayrollLists]]);
  }, [payrollCompData]);

  useEffect(() => {
    if (freq_type === "monthly" && payroll_freq_ids.length > 1) {
      return setFormValues((prev) => {
        const new_payroll_freq_ids = prev.payroll_freq_ids.slice(0, -1);
        return { ...prev, payroll_freq_ids: new_payroll_freq_ids };
      });
    }
    if (freq_type === "semi-monthly" && payroll_freq_ids.length === 1) {
      setConsolidatedData((prev) => [...prev, [...defaultEmpPayrollLists]]);
      return setFormValues((prev) => {
        const new_payroll_freq_ids = [
          ...prev.payroll_freq_ids,
          {
            ...payroll_freq_idsDefault,
            period: "second",
          },
        ];
        return { ...prev, payroll_freq_ids: new_payroll_freq_ids };
      });
    }
  }, [freq_type]);

  const addAPI = async () => {
    const data = {
      freq_type: formValues.freq_type,
      payroll_freq_ids: [],
    };

    consolidatedDataTable.map((grp, grpIndex) => {
      const selected_payroll_freq_ids = formValues.payroll_freq_ids[grpIndex];

      if (selected_payroll_freq_ids?.payroll_period_id?.length < 1) {
        return openFailedModal({
          title: "Failed",
          message: `Invalid payroll period at ${selected_payroll_freq_ids.period} payslip`,
          closeNameBtn: "Back",
        });
      }
      const currentPeriod = {
        period: selected_payroll_freq_ids?.period,
        payroll_period_id: selected_payroll_freq_ids?.payroll_period_id,
        payroll_cmp_ids: [],
      };

      grp.map((currentGrp, currentGrpIndex) => {
        currentGrp.items.map((item, index) => {
          if (item?.payroll_cmp_id?.length > 0) {
            return currentPeriod.payroll_cmp_ids.push(item);
          }
        });
      });

      return data.payroll_freq_ids.push(currentPeriod);
    });

    loadingHoc(true);

    //restruct contribution params prevent replacing general info
    const contriParams = {
      tin_no: employeeForm?.contribution?.tin_no,
      pagibig_no: employeeForm?.contribution?.pagibig_no,
      sss_no: employeeForm?.contribution?.sss_no,
      philhealth_no: employeeForm?.contribution?.philhealth_no,
    };

    const params = {
      mobileNo: "092359664",
      ...employeeForm.generalInfo,
      ...employeeForm.contribution,
      documents: employeeForm.documents,
      leave_credits: employeeForm.leave_credits,
      freq_type: formValues.freq_type,
      empPayrollLists: { ...data },
      basicPays: employeeForm?.basicPays,
      bankName: employeeForm?.emp_bank_acc?.name,
      bankAcc: employeeForm?.emp_bank_acc?.account,
    };

    const { status } = await POST("/employees", params);
    if (status === 201) {
      navigate("/admin/employees");
      loadingHoc(false);
      openSuccessModal();
      clearEmployeeForm();
      return fetchAllEmployee();
    } else {
      return loadingHoc(false);
    }
  };

  const submitFunc = () => {
    addAPI();
  };

  return (
    <div className="min-h-screen pb-10">
      {contributionInformation()}
      {payroll_freq_ids.length > 0 &&
        payroll_freq_ids.map((payroll, payroll_freq_ids_index) => {
          return setUpPayslip(payroll, payroll_freq_ids_index);
        })}
      {navigationLayout()}
    </div>
  );

  function contributionInformation() {
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
                  {
                    label: "Luzon",
                    value: "Luzon",
                  },
                  {
                    label: "Visayas",
                    value: "Visayas",
                  },
                ]}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                onChange={onChangeHandler}
                value={freq_type}
                label="Payroll Frequency"
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
  }

  function setUpPayslip(payroll, payroll_freq_ids_index) {
    const { payroll_period_id, period } = payroll;

    const payrollPeriodHandler = (e) => {
      const payroll_freq_ids_clonse = formValues.payroll_freq_ids;
      let payrollPeriodHandler =
        payroll_freq_ids_clonse[payroll_freq_ids_index];
      payrollPeriodHandler.payroll_period_id = e.target.value;
      setFormValues((prev) => ({
        ...prev,
        payroll_freq_ids: payroll_freq_ids_clonse,
      }));
    };
    return (
      <>
        <div className="mt-10 flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Setup {period === "first" ? "1st" : "2nd"} Payslip
          </span>
          <span className="text-sm  text-neutralGray">start day - end day</span>
          <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                onChange={payrollPeriodHandler}
                value={payroll_period_id}
                label="Payroll Period"
                options={[
                  {
                    label: "Select",
                    value: "",
                  },
                  ...forPeriodSelectData,
                ]}
              />
            </div>
          </div>
        </div>
        {consolidatedFirstPaySlip(payroll_freq_ids_index)}
      </>
    );
  }
  
  function consolidatedFirstPaySlip(payroll_freq_ids_index) {
    const updateExisitngList = (action, motherIndex, childIndex) => {
      const consolidatedDataTableClone = [...consolidatedDataTable];
      const selectedDataTable =
        consolidatedDataTableClone[payroll_freq_ids_index];

      if (action === "remove") {
        selectedDataTable[motherIndex].items.splice(childIndex, 1);
      } else {
        selectedDataTable[motherIndex].items.push(payrollCompDefault);
      }
      consolidatedDataTableClone[payroll_freq_ids_index] = selectedDataTable;
      return setConsolidatedData(consolidatedDataTableClone);
    };

    const childrenOnChange = (event, motherIndex, childIndex) => {
      const { name, value } = event.target || {};
      const consolidatedDataTableClone = [...consolidatedDataTable]; //clone the table data

      const selectedDataTable =
        consolidatedDataTableClone[payroll_freq_ids_index];
      let selectedGrp = selectedDataTable[motherIndex]; // get the current items list of for main list
      selectedGrp.items[childIndex] = {
        ...selectedGrp.items[childIndex],
        [name]: value,
      }; // get the current value for manipulations

      selectedDataTable[motherIndex] = selectedGrp;
      consolidatedDataTableClone[payroll_freq_ids_index] = selectedDataTable;
      return setConsolidatedData(consolidatedDataTableClone);
    };
    return (
      <>
        {consolidatedDataTable.length > 0 &&
          consolidatedDataTable[payroll_freq_ids_index].map(
            (data, motherIndex) => {
              return (
                <>
                  <div className="bg-highlight px-2 text-base">{data.name}</div>
                  <div className="mb-7 mt-4  grid grid-cols-5 gap-2 px-4">
                    <div className=" col-span-2 flex items-center">
                      <span className=" text-xs text-neutralGray">NAME</span>
                    </div>
                    <div className="col-span-2 text-xs text-neutralGray">
                      AMOUNT
                    </div>
                    <div className="flex justify-end text-xs text-neutralGray ">
                      REMOVE
                    </div>
                    {/* all the items below */}
                    {data.items.map((item, childIndex) => {
                      return (
                        <>
                          <div class="col-span-2 text-base">
                            <select
                              name="payroll_comp_id"
                              class="p-1 shadow-sm"
                              value={item._id}
                              onChange={(event) =>
                                childrenOnChange(event, motherIndex, childIndex)
                              }
                            >
                              <option disabled={item._id}>Select</option>
                              {data.optionsList.map((option) => {
                                return (
                                  <option key={option._id} value={option._id}>
                                    {option?.description}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div class="col-span-2 text-base">
                            <input
                              name="amount"
                              type="number"
                              class="p-1 shadow-sm"
                              value={item.amount}
                              onChange={(event) =>
                                childrenOnChange(event, motherIndex, childIndex)
                              }
                            />
                          </div>
                          <div className="flex justify-end text-xs text-neutralGray ">
                            <Io5icons.IoCloseCircleOutline
                              className="text-xl text-stateRed"
                              onClick={() =>
                                updateExisitngList(
                                  "remove",
                                  motherIndex,
                                  childIndex,
                                )
                              }
                            />
                          </div>
                        </>
                      );
                    })}

                    <div className="col-span-2 my-4">
                      <button
                        className="flex flex-row items-center text-primaryBlue"
                        onClick={() => updateExisitngList("add", motherIndex)}
                      >
                        <Io5icons.IoAdd />
                        Add
                      </button>
                    </div>
                  </div>
                </>
              );
            },
          )}
      </>
    );
  }

  function navigationLayout() {
    return (
      <>
        <div className="mt-10 grid grid-cols-1 gap-2 justify-self-end md:grid-cols-5">
          <div className="col-span-1 flex flex-row justify-between text-right md:col-span-5">
            <div
              onClick={() =>
                navigate(
                  `/admin/employees/${
                    id ? `manage-employee/${id}` : "create-employee"
                  }/step-3`,
                )
              }
              className="flex items-center  px-6 py-2 text-primaryBlue hover:cursor-pointer"
            >
              <Io5icons.IoArrowBackOutline className="mr-2" />
              Previous Page
            </div>
            {!id && (
              <div
                onClick={submitFunc}
                className="flex items-center rounded-lg bg-primaryBlue px-6  py-2 text-highlight hover:cursor-pointer"
              >
                Register
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
