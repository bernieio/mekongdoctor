import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Leaf, MapPin, Droplets, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Diagnosis {
  id: string;
  crop_type: string;
  salinity_level: number;
  province: string;
  district: string | null;
  symptoms: string | null;
  diagnosis_status: string;
  diagnosis_message: string;
  solutions: string[] | null;
  policy_info: string | null;
  image_urls: string[] | null;
  created_at: string;
}

interface DiagnosisHistoryProps {
  clerkUserId: string;
}

export function DiagnosisHistory({ clerkUserId }: DiagnosisHistoryProps) {
  const { t } = useLanguage();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke("get-diagnoses", {
          body: { clerkUserId },
        });

        if (error) {
          console.error("Error fetching diagnoses:", error);
          return;
        }

        if (data?.diagnoses) {
          setDiagnoses(data.diagnoses);
        }
      } catch (error) {
        console.error("Error in fetchDiagnoses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clerkUserId) {
      fetchDiagnoses();
    }
  }, [clerkUserId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "safe":
        return (
          <Badge className="bg-green-500/20 text-green-700 border border-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            An toàn
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-700 border border-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cảnh báo
          </Badge>
        );
      case "danger":
        return (
          <Badge className="bg-red-500/20 text-red-700 border border-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Nguy hiểm
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Lịch sử chẩn đoán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (diagnoses.length === 0) {
    return (
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Lịch sử chẩn đoán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Chưa có lịch sử chẩn đoán nào. Hãy sử dụng chức năng{" "}
            <a href="/diagnosis" className="text-primary underline">
              AI Chẩn đoán
            </a>{" "}
            để bắt đầu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          Lịch sử chẩn đoán ({diagnoses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {diagnoses.map((diagnosis) => (
            <AccordionItem
              key={diagnosis.id}
              value={diagnosis.id}
              className="border-2 border-border px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start gap-2 text-left w-full pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{diagnosis.crop_type}</span>
                    {getStatusBadge(diagnosis.diagnosis_status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {diagnosis.salinity_level}‰
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {diagnosis.district ? `${diagnosis.district}, ` : ""}
                      {diagnosis.province}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(diagnosis.created_at)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* Symptoms */}
                  {diagnosis.symptoms && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Triệu chứng:</h4>
                      <p className="text-sm text-muted-foreground">{diagnosis.symptoms}</p>
                    </div>
                  )}

                  {/* Diagnosis Message */}
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Chẩn đoán:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {diagnosis.diagnosis_message}
                    </p>
                  </div>

                  {/* Solutions */}
                  {diagnosis.solutions && diagnosis.solutions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Giải pháp:</h4>
                      <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                        {diagnosis.solutions.map((solution, idx) => (
                          <li key={idx}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Policy Info */}
                  {diagnosis.policy_info && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Thông tin chính sách:</h4>
                      <p className="text-sm text-muted-foreground">{diagnosis.policy_info}</p>
                    </div>
                  )}

                  {/* Images */}
                  {diagnosis.image_urls && diagnosis.image_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Hình ảnh:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {diagnosis.image_urls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Diagnosis image ${idx + 1}`}
                            className="h-20 w-20 object-cover border-2 border-border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
