import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Printer } from "lucide-react";
import type { AssessmentFormData } from "@shared/assessment";

interface PrintReportProps {
  assessment: AssessmentFormData & {
    flightRisk: number;
    metabolicRisk: number;
    healthRisk: number;
    overallRisk: number;
    riskLevel: string;
    suggestions: Array<{ title: string; content: string }>;
  };
}

export function PrintReport({ assessment }: PrintReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * 使用html2canvas捕获DOM元素并生成PDF
   */
  const generatePDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    try {
      // 获取报告容器的尺寸
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowHeight: element.scrollHeight,
      });

      // 创建PDF文档
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4宽度（mm）
      const pageHeight = 297; // A4高度（mm）
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 处理多页面
      while (heightLeft >= 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          position = heightLeft - imgHeight;
        }
      }

      // 下载PDF
      const fileName = `飞行员结石风险评估报告_${assessment.pilotName || "未命名"}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF生成失败:", error);
      alert("PDF生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 打印报告
   */
  const handlePrint = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    try {
      // 创建打印窗口
      const printWindow = window.open("", "", "width=1200,height=800");
      if (!printWindow) {
        alert("无法打开打印窗口，请检查浏览器设置");
        return;
      }

      // 获取报告HTML
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowHeight: element.scrollHeight,
      });