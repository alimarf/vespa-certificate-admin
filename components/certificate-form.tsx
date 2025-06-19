'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CertificateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaPeserta: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({
    namaPeserta: '',
    description: ''
  });
  
  const MAX_NAMA_PESERTA = 15;
  const MAX_DESCRIPTION = 20;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { namaPeserta: '', description: '' };
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    router.push(`/preview?namaPeserta=${encodeURIComponent(formData.namaPeserta)}&desc=${encodeURIComponent(formData.description)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Batu Vespa Fest 2025</CardTitle>
        <CardDescription>Masukkan detail untuk membuat sertifikat</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="namaPeserta">Nama Peserta</Label>
              <span className="text-xs text-muted-foreground">
                {formData.namaPeserta.length}/{MAX_NAMA_PESERTA}
              </span>
            </div>
            <Input
              id="namaPeserta"
              name="namaPeserta"
              placeholder="Masukkan nama peserta"
              value={formData.namaPeserta}
              onChange={handleChange}
              maxLength={MAX_NAMA_PESERTA}
              className={errors.namaPeserta ? 'border-red-500' : ''}
              required
            />
            {errors.namaPeserta && (
              <p className="text-xs text-red-500">{errors.namaPeserta}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Deskripsi</Label>
              <span className="text-xs text-muted-foreground">
                {formData.description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Input
              id="description"
              name="description"
              placeholder="cth: asal kota/nama club/independen"
              value={formData.description}
              onChange={handleChange}
              maxLength={MAX_DESCRIPTION}
              className={errors.description ? 'border-red-500' : ''}
              required
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Buat Sertifikat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
