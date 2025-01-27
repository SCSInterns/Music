// Updated FormBuilder Component
"use client";
import { useState } from "react";
import { Button, Card, CardContent, TextField } from "@mui/material";
import FieldDialog from "./DFormDialog";
import {
  CheckSquare,
  RadioReceiverIcon as RadioButton,
  Type,
  ChevronDown,
  BookOpen,
  Hash,
  Mail,
  AlignJustify,
  Phone,
} from "lucide-react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function FormBuilder() {
  const [selectedFieldType, setSelectedFieldType] = useState(null);
  const [formConfig, setFormConfig] = useState({ fields: [] });
  const [formName, setFormName] = useState("");

  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const fieldTypes = [
    { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
    { type: "radio", icon: RadioButton, label: "Radio Button" },
    { type: "text", icon: Type, label: "Input Field" },
    { type: "dropdown", icon: ChevronDown, label: "Dropdown" },
    { type: "dropdown-course", icon: BookOpen, label: "Course Dropdown" },
    { type: "number", icon: Hash, label: "Number" },
    { type: "email", icon: Mail, label: "Email" },
    { type: "textarea", icon: AlignJustify, label: "Text Area" },
    { type: "mobile-no", icon: Phone, label: "Mobile Number" },
  ];

  const handleFieldSave = (field) => {
    setFormConfig((prev) => ({
      fields: [...prev.fields, field],
    }));
    setSelectedFieldType(null);
  };

  console.log(formConfig);

  const token = Token();

  const handleSubmit = async () => {
    if (!formConfig.fields.some((field) => field.type === "email")) {
      toast.error(
        "You need to add an email field in the form for contact purposes."
      );
      return;
    }

    if (!formConfig.fields.some((field) => field.type === "mobile-no")) {
      toast.error(
        "You need to add a mobile number field in the form for contact purposes."
      );
      return;
    }

    if (!formName.trim()) {
      toast.error("Form Name is required");
      return;
    }

    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/academyregform";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        formname: formName.trim(),
        additionalFields: formConfig,
      }),
    });

    if (response.ok) {
      setFormConfig({ fields: [] });
      setFormName("");
      toast.success("Form Created Successfully");
    } else {
      toast.error("Form Creation Failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <TextField
          label="Form Name"
          variant="outlined"
          fullWidth
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter form name"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {fieldTypes.map(({ type, icon: Icon, label }) => (
          <Card
            key={type}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedFieldType(type)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icon className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {formConfig.fields.length > 0 && (
        <>
          <div className="border rounded-lg p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">Form Preview</h2>
            <div className="space-y-4">
              {formConfig.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === "text" && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      type="text"
                      rows={3}
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                    />
                  )}
                  {field.type === "checkbox" && (
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>{field.placeholder}</span>
                    </div>
                  )}
                  {field.type === "radio" && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            name={field.id}
                            className="mr-2"
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.type === "dropdown" && field.options && (
                    <select className="w-full p-2 border rounded">
                      <option value="">Select {field.label}</option>
                      {field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "dropdown-course" && field.courseDetails && (
                    <div className="space-y-2">
                      <select className="w-full p-2 border rounded">
                        <option value="">Select Course</option>
                        {field.courseDetails.map((detail, index) => (
                          <option key={index} value={detail.course}>
                            {detail.course} - ₹{detail.fees}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                    />
                  )}
                  {field.type === "mobile-no" && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                      pattern="^[0-9]{10}$"
                      title="Please enter a valid 10-digit mobile number"
                      maxLength={10}
                    />
                  )}

                  {field.type === "email" && (
                    <input
                      type="email"
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      title="Please enter a valid email address"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                width: "20%",
                bgcolor: "black",
                marginTop: "10px",
                marginBottom: "10px",
                float: "right",
                ":hover": { backgroundColor: "black" },
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      {selectedFieldType && (
        <FieldDialog
          open={true}
          onClose={() => setSelectedFieldType(null)}
          onSave={handleFieldSave}
          fieldType={selectedFieldType}
        />
      )}
    </div>
  );
}
