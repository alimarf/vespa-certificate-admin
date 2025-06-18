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
    namaClub: '',
    asalKota: ''
  });
  
  const [errors, setErrors] = useState({
    namaClub: '',
    asalKota: ''
  });
  
  const MAX_NAMA_CLUB = 15;
  const MAX_ASAL_KOTA = 20;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { namaClub: '', asalKota: '' };
    
    if (formData.namaClub.length > MAX_NAMA_CLUB) {
      newErrors.namaClub = `Maksimal ${MAX_NAMA_CLUB} karakter`;
      isValid = false;
    }
    
    if (formData.asalKota.length > MAX_ASAL_KOTA) {
      newErrors.asalKota = `Maksimal ${MAX_ASAL_KOTA} karakter`;
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
    
    router.push(`/preview?namaClub=${encodeURIComponent(formData.namaClub)}&asalKota=${encodeURIComponent(formData.asalKota)}`);
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
              <Label htmlFor="namaClub">Nama Club</Label>
              <span className="text-xs text-muted-foreground">
                {formData.namaClub.length}/{MAX_NAMA_CLUB}
              </span>
            </div>
            <Input
              id="namaClub"
              name="namaClub"
              placeholder="Masukkan nama club"
              value={formData.namaClub}
              onChange={handleChange}
              maxLength={MAX_NAMA_CLUB}
              className={errors.namaClub ? 'border-red-500' : ''}
              required
            />
            {errors.namaClub && (
              <p className="text-xs text-red-500">{errors.namaClub}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="asalKota">Asal Kota</Label>
              <span className="text-xs text-muted-foreground">
                {formData.asalKota.length}/{MAX_ASAL_KOTA}
              </span>
            </div>
            <Input
              id="asalKota"
              name="asalKota"
              placeholder="Masukkan asal kota"
              value={formData.asalKota}
              onChange={handleChange}
              maxLength={MAX_ASAL_KOTA}
              className={errors.asalKota ? 'border-red-500' : ''}
              required
            />
            {errors.asalKota && (
              <p className="text-xs text-red-500">{errors.asalKota}</p>
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
