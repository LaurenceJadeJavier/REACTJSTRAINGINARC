import React from "react";
import BackButton from "../../../../../components/buttons/back-button/BackButton";

export default function View() {
  return (
    <div className="flex flex-col gap-5">
      <BackButton />
      <div className=" flex h-full w-full flex-col gap-5 rounded-xl bg-white p-8 drop-shadow-xl lg:h-[90vh]">
        <div className="text-xl font-medium text-neutralDark">Sample Role</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill({
              _id: 1,
              title: "Lorem Ipsum",
              list: [
                "Sample Permission",
                "Sample Permission",
                "Sample Permission",
              ],
            })
            .map((data) => {
              const { _id, title, list } = data ?? {};
              return (
                <div
                  className="border-neutralLight flex flex-col gap-2 rounded-xl border p-5"
                  key={_id}
                >
                  <div className="font-medium">{title}</div>

                  <div className="ml-2 flex flex-col gap-2">
                    {list.map((res, index) => (
                      <div className="form-control" key={index}>
                        <div className="flex cursor-pointer gap-2">
                          <input
                            className="checkbox-success checkbox h-5 w-5"
                            type="checkbox"
                          />
                          <span className="label-text">{res}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
