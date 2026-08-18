import React, { useState } from "react";
import * as XLSX from "xlsx";
import API from "../api/api";
import axios from "axios";


const ExcelImport = ({ onClose }) => {
    const [excelData, setExcelData] = useState([]);
    const [formData, setFormData] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = event.target.result;

                const workbook = XLSX.read(data, {
                    type: "array",
                });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const parsedData = XLSX.utils.sheet_to_json(sheet, {
                    defval: "",
                });

                console.log("Original Excel Data:", parsedData);

                setExcelData(parsedData);

                // Convert Excel columns to your API/database fields
                const formattedData = parsedData.map((row) => ({
                    asset_code: row["Asset Code"] || "[Need to Update]",
                    project_no: row["Project Number"] || "[Need to Update]",
                    po_no: row["PO Number"] || "",
                    intendor_name: row["Intendor Name"] || "[Need to Update]",
                    technical_specification: row["Particular of Asset"] || "[Need to Update]",
                    make: row["Make"] || "[Need to Update]",
                    model: row["Model"] || "[Need to Update]",
                    rating: row["Rating"] || "[Need to Update]",
                    asset_classification: row["Asset Classification"] || "[Need to Update]",
                    purchaseDate: row["Date of Purchase"] || "",
                    cost: row["Cost of Store"] || 0,
                    store_classification: row["Classification of Store"] || "[Need to Update]",
                    assignedTo: row["Assigned To"] || "[Need to Update]",
                    location: row["Location"] || "[Need to Update]",
                }));

                console.log("Formatted Form Data:", formattedData);

                setFormData(formattedData);

            } catch (error) {
                console.error("Error reading Excel file:", error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.length === 0) {
            alert("Please import an Excel file first.");
            return;
        }

        try {
            console.log("Sending to backend:", formData);

            const response = await API.post(
                "/post-data-excel",
                formData
            );

            console.log("Saved successfully:", response.data);

            alert("Excel data saved successfully!");

            onClose();

        } catch (error) {
            console.error("Failed to save data:", error);

            alert("Failed to save Excel data.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 p-3 sm:p-4 overflow-y-auto">

            <div className="flex min-h-full items-start sm:items-center justify-center py-3 sm:py-6">

                <div className="relative w-full max-w-7xl rounded-xl sm:rounded-2xl bg-white shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b px-4 sm:px-6 py-4 shrink-0">

                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                            Import Data From Excel
                        </h2>

                        <div className="flex items-center gap-2 sm:gap-3">

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="
                                    w-fit sm:w-auto
                                    max-w-full sm:max-w-52
                                    border border-gray-500
                                    hover:cursor-pointer
                                    hover:bg-gray-500
                                    transition-all duration-300
                                    hover:text-white
                                    text-black
                                    rounded-lg
                                    px-2 sm:px-3
                                    py-1
                                    outline-none
                                    focus:ring
                                    focus:ring-gray-400
                                    text-xs sm:text-sm
                                "
                            />

                            <button
                                onClick={onClose}
                                className="
                                    shrink-0
                                    rounded-lg
                                    px-3
                                    py-1
                                    text-xl
                                    font-bold
                                    text-gray-500
                                    hover:bg-gray-100
                                "
                            >
                                ✕
                            </button>

                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-3 sm:p-6">

                        {excelData.length === 0 ? (

                            <div className="flex min-h-62.5 items-center justify-center">
                                <div className="text-center">

                                    <p className="text-gray-500 text-sm sm:text-base">
                                        No Excel data imported yet.
                                    </p>

                                    <p className="mt-1 text-xs sm:text-sm text-gray-400">
                                        Choose an Excel file to display its data here.
                                    </p>

                                </div>
                            </div>

                        ) : (

                            <div className="w-full overflow-x-auto rounded-lg border border-gray-200">

                                <table className="min-w-max w-full border-collapse text-xs sm:text-sm">

                                    <thead className="sticky top-0 z-10 bg-gray-800 text-white">

                                        <tr>
                                            {Object.keys(excelData[0]).map((key) => (
                                                <th
                                                    key={key}
                                                    className="
                                                        border-b
                                                        border-gray-600
                                                        px-3 sm:px-4
                                                        py-3
                                                        text-left
                                                        font-semibold
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {excelData.map((row, rowIndex) => (

                                            <tr
                                                key={rowIndex}
                                                className="
                                                    border-b
                                                    border-gray-200
                                                    hover:bg-gray-50
                                                "
                                            >

                                                {Object.keys(excelData[0]).map((key) => (

                                                    <td
                                                        key={key}
                                                        className="
                                                            px-3 sm:px-4
                                                            py-3
                                                            text-gray-700
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row[key] !== undefined &&
                                                        row[key] !== null &&
                                                        row[key] !== ""
                                                            ? String(row[key])
                                                            : "-"}
                                                    </td>

                                                ))}

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                    {/* Footer */}
                    {excelData.length > 0 && (

                        <div className="border-t px-4 sm:px-6 py-3 shrink-0 bg-gray-50 flex items-center justify-between">

                            <p className="text-xs sm:text-sm text-gray-600">
                                Total records:{" "}
                                <span className="font-semibold text-gray-800">
                                    {excelData.length}
                                </span>
                            </p>

                            <button
                                onClick={handleSubmit}
                                className="
                                    rounded-lg
                                    bg-gray-800
                                    px-4 sm:px-6
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-gray-700
                                    transition
                                "
                            >
                                Save Data
                            </button>

                        </div>

                    )}

                </div>
            </div>
        </div>
    );
};

export default ExcelImport;