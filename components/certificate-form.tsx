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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to preview page with query parameters
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
            <Label htmlFor="namaClub">Nama Club</Label>
            <Input
              id="namaClub"
              name="namaClub"
              placeholder="Masukkan nama club"
              value={formData.namaClub}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asalKota">Asal Kota</Label>
            <Input
              id="asalKota"
              name="asalKota"
              placeholder="Masukkan asal kota"
              value={formData.asalKota}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Buat Sertifikat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
