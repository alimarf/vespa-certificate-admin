/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CertificateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaPeserta: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    namaPeserta: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const MAX_NAMA_PESERTA = 15;
  const MAX_DESCRIPTION = 20;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { namaPeserta: "", description: "" };

    if (formData.namaPeserta.length > MAX_NAMA_PESERTA) {
      newErrors.namaPeserta = `Maksimal ${MAX_NAMA_PESERTA} karakter`;
      isValid = false;
    }

    if (formData.description.length > MAX_DESCRIPTION) {
      newErrors.description = `Maksimal ${MAX_DESCRIPTION} karakter`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const payload = {
        namaPeserta: formData.namaPeserta,
        description: formData.description
      };
      
      // console.log('Submitting form with data:', payload);
      
      // Submit to our Next.js API route
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
      
      const result = await response.json();
      // console.log('Form submission successful:', result);
      
      // Navigate to preview page on successful submission
      router.push(
        `/preview?namaPeserta=${encodeURIComponent(
          formData.namaPeserta
        )}&desc=${encodeURIComponent(formData.description)}`
      );
    } catch (error) {
      // console.error('Error submitting form:', error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl overflow-hidden bg-white rounded-2xl">
      <div className="px-6 pt-6 text-center">
        <h2 className="text-2xl font-bold font-sans text-gray-800">
          Batu Vespa Fest 2025
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Buat sertifikat kerenmu sekarang!
        </p>
      </div>

      <CardContent className="p-6 pt-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor="namaPeserta"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Kamu
              </label>
              <span className="text-xs text-gray-500">
                {formData.namaPeserta.length}/{MAX_NAMA_PESERTA}
              </span>
            </div>
            <div className="relative">
              <input
                id="namaPeserta"
                name="namaPeserta"
                placeholder="Tulis nama kamu di sini"
                value={formData.namaPeserta}
                onChange={handleChange}
                maxLength={MAX_NAMA_PESERTA}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.namaPeserta ? "border-red-400" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white`}
                required
              />
              {errors.namaPeserta && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.namaPeserta}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4"></div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Asal / Club
              </label>
              <span className="text-xs text-gray-500">
                {formData.description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <div className="relative">
              <input
                id="description"
                name="description"
                placeholder="Contoh: Malang / Vespa Club Malang / Independen"
                value={formData.description}
                onChange={handleChange}
                maxLength={MAX_DESCRIPTION}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.description ? "border-red-400" : "border-gray-200"
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4"></div>

          <div className="space-y-2">
            <Button 
              type="submit"
              disabled={isSubmitting} 
              className={`w-full text-white relative bg-gray-600 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Memproses Sertifikat...</span>
                </span>
              ) : (
                'Buat Sertifikat 🚀'
              )}
            </Button>
            {submitError && (
              <p className="text-red-500 text-sm text-center">{submitError}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
