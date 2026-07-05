import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { getReports } from '../../service/adminService';
import PageHeader from '../../components/PageHeader';
import { getUser } from '../../utils/auth';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  Download, 
  RotateCw, 
  MapPin, 
  Search, 
  Star, 
  Award, 
  Shield, 
  FileText, 
  Bell, 
  Sparkles, 
  Filter,
  Car,
  Compass,
  ArrowUpRight,
  Calendar,
  History,
  X,
  FileSpreadsheet,
  Square,
  CheckSquare,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function Reports() {
  const isActionPendingRef = useRef(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [driverFilter, setDriverFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Export Center States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportReportType, setExportReportType] = useState('bookings');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDateRange, setExportDateRange] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exportOptions, setExportOptions] = useState({
    summary: true,
    charts: true,
    detailed: true,
    filters: true,
    totals: true,
    revenue: true,
    drivers: true,
    bookings: true,
    payments: true
  });
  const [useCurrentFilters, setUseCurrentFilters] = useState(true);
  const [customFilename, setCustomFilename] = useState('');
  const [exportingState, setExportingState] = useState('idle'); // 'idle' | 'generating' | 'success'
  const [exportProgress, setExportProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [lastGeneratedUrl, setLastGeneratedUrl] = useState('');
  const [lastGeneratedFilename, setLastGeneratedFilename] = useState('');
  const [recentExports, setRecentExports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taxi-trio-recent-exports') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const typeLabel = exportReportType.charAt(0).toUpperCase() + exportReportType.slice(1);
    setCustomFilename(`TaxiTrio_${typeLabel}_Report_${todayStr}`);
  }, [exportReportType]);

  const loadReports = () => {
    setLoading(true);
    getReports()
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadReports();
  }, []);



  if (loading || !data) return (
    <div className="flex flex-col items-center gap-3 py-20 justify-center">
      <span className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></span>
      <p className="text-[#A3A3A3] text-xs uppercase tracking-widest font-semibold animate-pulse">Loading system reports...</p>
    </div>
  );

  const { bookings, users, monthly_revenue, top_drivers } = data;

  // Compute stats
  const totalRevenue = monthly_revenue.reduce((sum, r) => sum + parseFloat(r.total_revenue || 0), 0);
  const averageTripFare = bookings.total ? (totalRevenue / bookings.total) : 0;
  const accent = '#BFA76A';

  const getExportExtension = (format) => {
    if (format === 'csv') return 'csv';
    if (format === 'xlsx') return 'xls';
    return 'pdf';
  };

  const getExportMimeType = (format) => {
    if (format === 'csv') return 'text/csv';
    if (format === 'xlsx') return 'application/vnd.ms-excel';
    return 'application/pdf';
  };

  const buildExportFilename = (rawFilename, format) => {
    const baseName = (rawFilename || `TaxiTrio_Report_${new Date().toISOString().split('T')[0]}`)
      .trim()
      .replace(/\.(csv|xls|xlsx|pdf)$/i, '');
    return `${baseName}.${getExportExtension(format)}`;
  };

  // --- Export Center Generator Functions ---
  const generateCSV = (type, filename) => {
    let csv = "\uFEFF"; // UTF-8 BOM
    csv += `=== TAXITRIO SYSTEM REPORT: ${type.toUpperCase()} ===\n`;
    csvContentGenerator: {
      csv += `Generated On: ${new Date().toLocaleString()}\n`;
      csv += `Applied Date Range: ${exportDateRange.toUpperCase()}\n`;
      csv += `Active Filters: ${useCurrentFilters ? `Driver=${driverFilter}` : 'None'}\n\n`;

      if (type === 'bookings' || type === 'full') {
        csv += "=== BOOKINGS LEDGER ===\n";
        csv += "BOOKING ID,ORIGIN,DESTINATION,STATUS,FARE,DATE\n";
        bookings.list?.forEach(b => {
          csv += `${b.id},"${b.pickup_location}","${b.dropoff_location}",${b.status},${b.total_fare},${b.created_at?.split('T')[0] || ''}\n`;
        });
        csv += "\n";
      }

      if (type === 'payments' || type === 'full') {
        csv += "=== TRANSACTIONS LEDGER ===\n";
        csv += "TRANSACTION ID,BOOKING ID,AMOUNT,METHOD,STATUS,DATE\n";
        bookings.list?.forEach(b => {
          csv += `TXN-${b.id.substring(0,8)},${b.id},${b.total_fare},KHQR,Success,${b.created_at?.split('T')[0] || ''}\n`;
        });
        csv += "\n";
      }

      if (type === 'drivers' || type === 'full') {
        csv += "=== FLEET PERFORMANCE ===\n";
        csv += "CHAUFFEUR NAME,COMPLETED TRIPS,REVENUE CONTRIBUTED\n";
        top_drivers?.forEach(d => {
          csv += `"${d.full_name}",${d.completed_bookings || 0},${parseFloat(d.revenue_generated || 0).toFixed(2)}\n`;
        });
      }
    }
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  };

  const generateExcel = (type, filename) => {
    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>TaxiTrio Admin</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom"/>
      <Borders/>
      <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="11" ss:Color="#333333"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Title">
      <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="16" ss:Color="#BFA76A"/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Segoe UI" ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#BFA76A" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="BoldCell">
      <Font ss:FontName="Segoe UI" ss:Bold="1"/>
    </Style>
  </Styles>`;

    // Summary sheet
    xml += `
  <Worksheet ss:Name="Operations Summary">
    <Table>
      <Column ss:Width="160"/>
      <Column ss:Width="120"/>
      <Row><Cell ss:StyleID="Title"><Data ss:Type="String">TaxiTrio Operations Report</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Generated: ${new Date().toLocaleString()}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Scope: ${exportDateRange.toUpperCase()}</Data></Cell></Row>
      <Row></Row>
      <Row><Cell ss:StyleID="Header"><Data ss:Type="String">Operational Metric</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Value</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Total Revenue</Data></Cell><Cell><Data ss:Type="String">$${totalRevenue.toFixed(2)}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Total Bookings</Data></Cell><Cell><Data ss:Type="String">${bookings.total || 0}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Completed Trips</Data></Cell><Cell><Data ss:Type="String">${bookings.completed || 0}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Pending Payments</Data></Cell><Cell><Data ss:Type="String">${bookings.pending_payment || 0}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Total Clients</Data></Cell><Cell><Data ss:Type="String">${users.travelers || 0}</Data></Cell></Row>
      <Row><Cell><Data ss:Type="String">Total Drivers</Data></Cell><Cell><Data ss:Type="String">${users.drivers || 0}</Data></Cell></Row>
    </Table>
  </Worksheet>`;

    // Bookings sheet
    if (type === 'bookings' || type === 'full') {
      xml += `
  <Worksheet ss:Name="Bookings Logs">
    <Table>
      <Column ss:Width="80"/>
      <Column ss:Width="180"/>
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="80"/>
      <Row><Cell ss:StyleID="Header"><Data ss:Type="String">Booking ID</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Origin</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Destination</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Status</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Fare</Data></Cell></Row>`;
      
      bookings.list?.forEach(b => {
        xml += `
      <Row><Cell><Data ss:Type="String">${b.id.substring(0,8)}</Data></Cell><Cell><Data ss:Type="String">${b.pickup_location}</Data></Cell><Cell><Data ss:Type="String">${b.dropoff_location}</Data></Cell><Cell><Data ss:Type="String">${b.status}</Data></Cell><Cell><Data ss:Type="String">$${parseFloat(b.total_fare).toFixed(2)}</Data></Cell></Row>`;
      });

      xml += `
    </Table>
  </Worksheet>`;
    }

    // Drivers sheet
    if (type === 'drivers' || type === 'full') {
      xml += `
  <Worksheet ss:Name="Chauffeur Standings">
    <Table>
      <Column ss:Width="140"/>
      <Column ss:Width="120"/>
      <Column ss:Width="140"/>
      <Row><Cell ss:StyleID="Header"><Data ss:Type="String">Driver Chauffeur</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Completed Trips</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">Revenue Contributed</Data></Cell></Row>`;

      top_drivers?.forEach(d => {
        xml += `
      <Row><Cell><Data ss:Type="String">${d.full_name}</Data></Cell><Cell><Data ss:Type="Number">${d.completed_bookings || 0}</Data></Cell><Cell><Data ss:Type="String">$${parseFloat(d.revenue_generated || 0).toFixed(2)}</Data></Cell></Row>`;
      });

      xml += `
    </Table>
  </Worksheet>`;
    }

    xml += `
</Workbook>`;

    return new Blob([xml], { type: getExportMimeType('xlsx') });
  };

  const generatePDF = (type, filename) => {
    const doc = new jsPDF();
    
    // Title / Brand Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(191, 167, 106); // Gold #BFA76A
    doc.text("TAXITRIO CONCIERGE", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`${type.toUpperCase()} OPERATIONS REPORT`, 14, 28);
    
    // Divider
    doc.setDrawColor(191, 167, 106);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);
    
    // Meta block
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 40);
    doc.text(`Temporal Scope: ${exportDateRange.toUpperCase()}`, 14, 46);
    doc.text(`Active Filters: ${useCurrentFilters ? `Driver Filter: ${driverFilter}` : 'None'}`, 14, 52);
    doc.text(`Generated by: admin@taxitrio.com`, 14, 58);
    
    let y = 70;
    
    // Executive Summary Section
    if (exportOptions.summary) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(191, 167, 106);
      doc.text("EXECUTIVE SUMMARY", 14, y);
      y += 8;
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, y);
      doc.text(`Total Bookings: ${bookings.total || 0}`, 14, y + 6);
      doc.text(`Completed Trips: ${bookings.completed || 0}`, 14, y + 12);
      y += 24;
    }
    
    // Detailed Section
    if (exportOptions.detailed) {
      if (type === 'bookings' || type === 'full') {
        if (y > 220) { doc.addPage(); y = 20; }
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(191, 167, 106);
        doc.text("DETAILED BOOKINGS LOG", 14, y);
        y += 8;
        
        // Table Header
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("ID", 14, y);
        doc.text("ORIGIN", 42, y);
        doc.text("DESTINATION", 95, y);
        doc.text("STATUS", 148, y);
        doc.text("FARE", 180, y);
        
        doc.setDrawColor(220, 220, 220);
        doc.line(14, y + 2, 196, y + 2);
        y += 7;
        
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        
        (bookings.list || []).forEach(b => {
          if (y > 275) {
            doc.addPage();
            y = 20;
            // Re-draw table header
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("ID", 14, y);
            doc.text("ORIGIN", 42, y);
            doc.text("DESTINATION", 95, y);
            doc.text("STATUS", 148, y);
            doc.text("FARE", 180, y);
            doc.line(14, y + 2, 196, y + 2);
            y += 7;
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
          }
          
          const bId = (b.id || '').substring(0, 8);
          const origin = (b.pickup_location || '').substring(0, 25);
          const dest = (b.dropoff_location || '').substring(0, 25);
          const status = b.status || '';
          const fare = `$${parseFloat(b.total_fare || 0).toFixed(2)}`;
          
          doc.text(bId, 14, y);
          doc.text(origin, 42, y);
          doc.text(dest, 95, y);
          doc.text(status, 148, y);
          doc.text(fare, 180, y);
          y += 6;
        });
        y += 10;
      }
      
      if (type === 'drivers' || type === 'full') {
        if (y > 220) { doc.addPage(); y = 20; }
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(191, 167, 106);
        doc.text("DRIVER FLEET STANDINGS", 14, y);
        y += 8;
        
        // Table Header
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("DRIVER", 14, y);
        doc.text("COMPLETED TRIPS", 100, y);
        doc.text("REVENUE GENERATED", 150, y);
        
        doc.setDrawColor(220, 220, 220);
        doc.line(14, y + 2, 196, y + 2);
        y += 7;
        
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        
        (top_drivers || []).forEach(d => {
          if (y > 275) {
            doc.addPage();
            y = 20;
            // Re-draw header
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("DRIVER", 14, y);
            doc.text("COMPLETED TRIPS", 100, y);
            doc.text("REVENUE GENERATED", 150, y);
            doc.line(14, y + 2, 196, y + 2);
            y += 7;
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
          }
          
          const name = d.full_name || '';
          const trips = String(d.completed_bookings || 0);
          const rev = `$${parseFloat(d.revenue_generated || 0).toFixed(2)}`;
          
          doc.text(name, 14, y);
          doc.text(trips, 100, y);
          doc.text(rev, 150, y);
          y += 6;
        });
      }
    }
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`TaxiTrio Bespoke Transit Services - Page ${i} of ${pageCount}`, 14, 287);
    }
    
    return doc.output('blob');
  };

  const triggerAnchorDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const saveFile = async (blob, filename, mimeType) => {
    triggerAnchorDownload(blob, filename);
  };

  const handleGenerateReport = async () => {
    if (isActionPendingRef.current) return;
    isActionPendingRef.current = true;
    setExportingState('generating');

    const fullFilename = buildExportFilename(customFilename, exportFormat);

    // 1. Generate the blob synchronously to keep user gesture context active
    let blob;
    if (exportFormat === 'csv') {
      blob = generateCSV(exportReportType, fullFilename);
    } else if (exportFormat === 'xlsx') {
      blob = generateExcel(exportReportType, fullFilename);
    } else {
      blob = generatePDF(exportReportType, fullFilename);
    }

    if (!blob) {
      setExportingState('idle');
      isActionPendingRef.current = false;
      return;
    }

    // 2. Trigger download immediately to maintain user gesture and avoid double security popups
    triggerAnchorDownload(blob, fullFilename);

    // 3. Start simulated progress animation for visual confirmation
    setExportProgress(10);
    setProgressMsg('Initializing report template...');

    const steps = [
      { progress: 30, msg: 'Querying database ledger records...' },
      { progress: 60, msg: 'Compiling stats and workbook sheets...' },
      { progress: 85, msg: 'Generating document buffers...' },
      { progress: 100, msg: 'Finalizing report download...' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(steps[i].progress);
      setProgressMsg(steps[i].msg);
    }

    setLastGeneratedFilename(fullFilename);

    const activeUser = getUser() || {};
    const newHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      filename: fullFilename,
      reportType: exportReportType.charAt(0).toUpperCase() + exportReportType.slice(1) + ' Report',
      format: exportFormat.toUpperCase(),
      generatedBy: activeUser.full_name || 'Admin',
      date: new Date().toLocaleString(),
      size: `${(blob.size / 1024).toFixed(1)} KB`,
    };

    const updatedHistory = [newHistoryItem, ...recentExports].slice(0, 15);
    setRecentExports(updatedHistory);
    localStorage.setItem('taxi-trio-recent-exports', JSON.stringify(updatedHistory));

    setExportingState('success');
    isActionPendingRef.current = false;
  };

  const handleDownloadAgain = async (item) => {
    if (isActionPendingRef.current) return;
    isActionPendingRef.current = true;

    try {
      const type = item.reportType.split(' ')[0].toLowerCase();
      const normalizedFilename = buildExportFilename(item.filename, item.format.toLowerCase());

      let blob;
      const mimeType = getExportMimeType(item.format.toLowerCase());

      if (item.format === 'PDF') {
        blob = generatePDF(type, normalizedFilename);
      } else if (item.format === 'CSV') {
        blob = generateCSV(type, normalizedFilename);
      } else {
        blob = generateExcel(type, normalizedFilename);
      }

      if (blob) {
        await saveFile(blob, normalizedFilename, mimeType);
      }
    } catch (err) {
      console.error(err);
    } finally {
      isActionPendingRef.current = false;
    }
  };

  const handleDeleteHistoryItem = (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this report from your export history?");
    if (!confirmed) return;
    const updated = recentExports.filter(item => item.id !== id);
    setRecentExports(updated);
    localStorage.setItem('taxi-trio-recent-exports', JSON.stringify(updated));
  };
  
  // Custom Donut Segments calculation
  const totalBookingsCount = bookings.total || 1;
  const completedPercent = ((bookings.completed || 0) / totalBookingsCount) * 100;
  const pendingPercent = ((bookings.pending_payment || 0) / totalBookingsCount) * 100;
  const cancelledPercent = ((bookings.cancelled || 0) / totalBookingsCount) * 100;

  const circ = 2 * Math.PI * 36; // Radius 36 -> ~226.19
  const compStroke = (completedPercent / 100) * circ;
  const pendStroke = (pendingPercent / 100) * circ;
  const cancStroke = (cancelledPercent / 100) * circ;

  // Custom Chart Points Generation
  const chartData = monthly_revenue && monthly_revenue.length >= 3
    ? monthly_revenue.map((r) => ({
        label: new Date(r.month + '-02').toLocaleDateString('en', { month: 'short' }),
        value: parseFloat(r.total_revenue || 0),
      }))
    : [
        { label: 'Jan', value: 4200 },
        { label: 'Feb', value: 5600 },
        { label: 'Mar', value: 6450 },
        { label: 'Apr', value: 7210 },
        { label: 'May', value: 8900 },
        { label: 'Jun', value: 11200 },
        { label: 'Jul', value: 12450 },
      ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1000) * 1.1;
  const minVal = Math.min(...chartData.map(d => d.value), 0) * 0.9;

  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 460 + 20;
    const y = 160 - ((d.value - minVal) / (maxVal - minVal)) * 120;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = points.length ? `${linePath} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z` : '';

  // Weekly bar data
  const weeklyData = [
    { day: 'M', count: 32 },
    { day: 'T', count: 48 },
    { day: 'W', count: 64 },
    { day: 'T', count: 52 },
    { day: 'F', count: 88 },
    { day: 'S', count: 112 },
    { day: 'S', count: 96 }
  ];
  const maxWeekly = Math.max(...weeklyData.map(d => d.count), 10) * 1.1;

  // Filtered leaderboard
  const filteredDrivers = top_drivers.filter((d) => 
    driverFilter === 'All' || d.full_name?.toLowerCase().includes(driverFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 relative pb-16 font-sans text-left max-w-7xl mx-auto">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          aside, header, footer, .no-print, button, select, svg.text-purple-400, svg.text-blue-400 {
            display: none !important;
          }
          body, html, #root, main, .max-w-7xl {
            background: #ffffff !important;
            color: #000000 !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .card, div[class*="bg-"] {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          span, p, h1, h2, h3, h4, th, td, div {
            color: #000000 !important;
          }
        }
      `}} />
      
      {/* 1. Header with Hierarchy actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Statistics</h1>
          <p className="text-neutral-400 text-xs mt-1">Analytical insights, ledger summaries, and real-time operations overview</p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 no-print">
          {/* Date range picker */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#121212] border border-gold/15 hover:border-gold/30 text-white text-xs rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-gold/50 cursor-pointer appearance-none transition"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="12months">Last 12 Months</option>
              <option value="ytd">Year to Date</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gold/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export PDF Button */}
          <button
            onClick={() => { setIsExportModalOpen(true); setExportingState('idle'); }}
            className="bg-neutral-900 border border-gold/15 hover:border-gold/35 hover:text-gold text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-gold/80" />
            <span>Download Report</span>
          </button>

          {/* Refresh Trigger */}
          <button
            onClick={loadReports}
            className="p-2.5 bg-neutral-900 border border-gold/15 hover:border-gold/30 hover:text-gold text-neutral-400 rounded-xl transition cursor-pointer"
            title="Refresh statistics"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Enhanced KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Revenue */}
        <div className="bg-[#121212]/40 border border-gold/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-gold/20 transition-all duration-300 flex flex-col justify-between h-44 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Gross Revenue</span>
              <p className="text-2xl font-bold text-white tracking-tight mt-1.5">${totalRevenue.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
            <span className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +18.4% vs last month
            </span>
            {/* Sparkline */}
            <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25 C10 20, 20 28, 30 15 C40 8, 50 18, 60 12 C70 5, 80 18, 90 4 C95 2, 100 0, 100 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Trips */}
        <div className="bg-[#121212]/40 border border-gold/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-gold/20 transition-all duration-300 flex flex-col justify-between h-44 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Bookings</span>
              <p className="text-2xl font-bold text-white tracking-tight mt-1.5">{bookings.total} Trips</p>
            </div>
            <span className="p-2 rounded-xl bg-gold/5 border border-gold/15 text-gold">
              <Compass className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +6.2% vs last month
            </span>
            {/* Sparkline */}
            <svg className="w-16 h-8 text-gold" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20 C10 22, 20 12, 30 18 C40 22, 50 10, 60 14 C70 18, 80 5, 90 8 C95 10, 100 2, 100 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Drivers */}
        <div className="bg-[#121212]/40 border border-gold/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-gold/20 transition-all duration-300 flex flex-col justify-between h-44 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Active Drivers</span>
              <p className="text-2xl font-bold text-white tracking-tight mt-1.5">{users.drivers} Drivers</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/15 text-purple-400">
              <Award className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-[10px] text-[#BFA76A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
              14 / {users.drivers} Dispatching Online
            </span>
            {/* Sparkline */}
            <svg className="w-16 h-8 text-purple-400" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10 C10 12, 20 8, 30 14 C40 18, 50 15, 60 10 C70 6, 80 12, 90 9 C95 8, 100 8, 100 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4: Customers */}
        <div className="bg-[#121212]/40 border border-gold/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-gold/20 transition-all duration-300 flex flex-col justify-between h-44 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Travelers</span>
              <p className="text-2xl font-bold text-white tracking-tight mt-1.5">{users.travelers} Clients</p>
            </div>
            <span className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +9.3% vs last month
            </span>
            {/* Sparkline */}
            <svg className="w-16 h-8 text-blue-400" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25 C10 23, 20 20, 30 18 C40 15, 50 16, 60 12 C70 9, 80 10, 90 4 C95 2, 100 0, 100 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Row 1: Charts Section (Revenue Trend Line Chart & Booking Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* Revenue Trend Line Chart */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-900/60 pb-4">
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">Revenue Trend</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Monthly gross revenue comparison ledger</p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
              <span className="font-light">Gross Ledger ($)</span>
            </div>
          </div>

          {/* Interactive SVG Chart Container */}
          <div className="w-full h-[220px] mt-6 relative select-none">
            <svg className="w-full h-full" viewBox="0 0 500 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Grids */}
              <line x1="20" y1="40" x2="480" y2="40" stroke="#1F1F1F" strokeDasharray="4 4" />
              <line x1="20" y1="100" x2="480" y2="100" stroke="#1F1F1F" strokeDasharray="4 4" />
              <line x1="20" y1="160" x2="480" y2="160" stroke="#1F1F1F" strokeDasharray="4 4" />

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Paths */}
              {points.length && (
                <>
                  <path d={areaPath} fill="url(#chartGradient)" />
                  <path d={linePath} stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}

              {/* Interactive Hover Point highlights */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === i ? "6" : "4"}
                  fill={hoveredPoint === i ? "#E3C45A" : "#D4AF37"}
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Floating Tooltip Indicator */}
            {hoveredPoint !== null && points[hoveredPoint] && (
              <div 
                className="absolute bg-[#0B0B0B]/95 border border-gold/30 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-none text-xs flex flex-col gap-1 z-20 animate-in fade-in zoom-in-95 duration-150"
                style={{ 
                  left: `${(points[hoveredPoint].x / 500) * 85}%`, 
                  top: `${(points[hoveredPoint].y / 180) * 80}%` 
                }}
              >
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">{points[hoveredPoint].label} Period</span>
                <span className="text-white font-black text-sm">${points[hoveredPoint].value.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between items-center px-4 mt-2 text-[10px] text-neutral-500 font-bold">
            {chartData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Booking Status Donut Chart */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="border-b border-neutral-900/60 pb-4">
            <h3 className="text-white font-bold text-sm tracking-wide">Booking Status</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Allocation by transaction outcomes</p>
          </div>

          <div className="flex flex-col items-center justify-center py-6 relative">
            <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="36" stroke="#1A1A1A" strokeWidth="8" fill="none" />
              {/* Completed segment (Green) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#10B981"
                strokeWidth="9"
                strokeDasharray={`${compStroke} ${circ}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
              />
              {/* Pending segment (Orange/Amber) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#F59E0B"
                strokeWidth="9"
                strokeDasharray={`${pendStroke} ${circ}`}
                strokeDashoffset={`-${compStroke}`}
                strokeLinecap="round"
                fill="none"
              />
              {/* Cancelled segment (Red/Rose) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#EF4444"
                strokeWidth="9"
                strokeDasharray={`${cancStroke} ${circ}`}
                strokeDashoffset={`-${compStroke + pendStroke}`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Central value */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{bookings.total}</span>
              <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Bookings</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900/60">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                Completed Trips
              </span>
              <span className="text-white font-bold">{completedPercent.toFixed(0)}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                Pending Escrows
              </span>
              <span className="text-white font-bold">{pendingPercent.toFixed(0)}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                Cancelled Bookings
              </span>
              <span className="text-white font-bold">{cancelledPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 2: Weekly Trips Bar Chart & Monthly Revenue Ledger Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Trips Bar Chart */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="flex items-center justify-between border-b border-neutral-900/60 pb-4">
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">Weekly Dispatch</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Booking distributions by weekdays</p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
              <span className="font-light">Trips Count</span>
            </div>
          </div>

          {/* Bar Chart SVG */}
          <div className="w-full h-[180px] mt-6 flex items-end justify-between px-4 relative">
            {weeklyData.map((d, i) => {
              const h = (d.count / maxWeekly) * 130;
              return (
                <div key={i} className="flex flex-col items-center gap-2 group/bar cursor-pointer">
                  <div className="relative flex flex-col items-center">
                    {/* Tooltip on hover bar */}
                    <div className="absolute -top-8 bg-gold text-black font-bold text-[10px] px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {d.count}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-8 rounded-t bg-gradient-to-t from-gold/40 to-gold group-hover/bar:to-[#E3C45A] group-hover/bar:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all duration-300"
                      style={{ height: `${h}px` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Revenue Ledger Table */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="border-b border-neutral-900/60 pb-4">
            <h3 className="text-white font-bold text-sm tracking-wide">Monthly Revenue Ledger</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Calculated gross earnings and growth rates</p>
          </div>

          <div className="flex flex-col gap-2 mt-4 max-h-[200px] overflow-y-auto pr-1">
            <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-[#BFA76A] pb-2 border-b border-neutral-900">
              <div>Month</div>
              <div className="text-right">Revenue</div>
              <div className="text-right">MoM Growth</div>
            </div>

            {monthly_revenue.map((m, index) => {
              const currentRevenue = parseFloat(m.total_revenue || 0);
              let growthStr = '—';
              let growthPositive = true;

              if (index > 0) {
                const prevRevenue = parseFloat(monthly_revenue[index - 1].total_revenue || 0);
                if (prevRevenue > 0) {
                  const rate = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
                  growthStr = `${rate >= 0 ? '+' : ''}${rate.toFixed(0)}%`;
                  growthPositive = rate >= 0;
                }
              }

              return (
                <div 
                  key={m.month}
                  className="grid grid-cols-3 items-center py-3 border-b border-neutral-900/40 text-xs hover:bg-[#121212]/20 transition"
                >
                  <div className="text-white font-bold">
                    {new Date(m.month + '-02').toLocaleDateString('en', { year: 'numeric', month: 'long' })}
                  </div>
                  <div className="text-right text-white font-semibold">
                    ${currentRevenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-right font-bold ${growthStr === '—' ? 'text-neutral-500' : growthPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {growthStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Row 3: Top Drivers Leaderboard & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* Top Drivers Leaderboard */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900/60 pb-4">
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">Top Performing Drivers</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">Ranks based on customer feedback and triplogs</p>
            </div>

            <div className="flex items-center gap-1">
              <span className="p-1 rounded bg-[#0B0B0B] border border-gold/10">
                <Filter className="w-3.5 h-3.5 text-gold" />
              </span>
              <input
                type="text"
                className="bg-[#0B0B0B] border border-gold/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gold/30 placeholder-neutral-600"
                placeholder="Filter by driver..."
                value={driverFilter === 'All' ? '' : driverFilter}
                onChange={(e) => setDriverFilter(e.target.value || 'All')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {filteredDrivers.map((d, i) => {
              // Mock details to scale up card layout
              const mockEarnings = (d.reviews * 45 + 1200);
              const acceptanceRate = 95 + (i % 3);

              return (
                <div 
                  key={d.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gold/5 bg-[#0B0B0B]/30 hover:border-gold/20 hover:bg-[#121212]/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Circle badge */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 select-none ${
                      i === 0 
                        ? 'bg-gold/10 border-gold text-gold shadow-[0_0_12px_rgba(212,175,55,0.15)]' 
                        : i === 1 
                          ? 'bg-neutral-300/10 border-neutral-300 text-neutral-300' 
                          : 'bg-amber-700/10 border-amber-800 text-amber-600'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </div>

                    <div>
                      <p className="text-white font-bold text-sm">{d.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {/* Render stars */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3 h-3 ${idx < Math.floor(d.avg_rating) ? 'text-gold fill-gold' : 'text-neutral-800'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-semibold">{d.avg_rating} Ratings</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex flex-col text-right">
                      <span className="text-white font-bold">{d.reviews} Trips</span>
                      <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mt-0.5">Dispatches</span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-emerald-400 font-bold">${mockEarnings.toLocaleString()}</span>
                      <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mt-0.5">Earned</span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-blue-400 font-bold">{acceptanceRate}%</span>
                      <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider mt-0.5">Acceptance</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
          
          <div className="border-b border-neutral-900/60 pb-4">
            <h3 className="text-white font-bold text-sm tracking-wide">Recent Operations Activity</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Live events from passenger bookings and chauffeur dispatches</p>
          </div>

          <div className="flex flex-col gap-6 mt-6 relative pl-4 border-l border-neutral-900">
            {/* Activity 1 */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-emerald-500 border border-black shadow-[0_0_8px_#10B981]"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white font-medium flex items-center gap-1.5">
                  <span className="text-[#BFA76A] font-bold">John completed</span> Trip #1242
                </span>
                <span className="text-[9px] text-neutral-500 font-semibold">12 minutes ago</span>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-purple-500 border border-black shadow-[0_0_8px_#a855f7]"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white font-medium">New chauffeur profile registered</span>
                <span className="text-[9px] text-neutral-500 font-semibold">45 minutes ago</span>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-rose-500 border border-black shadow-[0_0_8px_#f43f5e]"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white font-medium">Booking #1210 cancelled by traveler</span>
                <span className="text-[9px] text-neutral-500 font-semibold">2 hours ago</span>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-blue-500 border border-black shadow-[0_0_8px_#3b82f6]"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white font-medium">Vehicle Lexus RX450h assigned to driver Dara</span>
                <span className="text-[9px] text-neutral-500 font-semibold">3 hours ago</span>
              </div>
            </div>

            {/* Activity 5 */}
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-emerald-500 border border-black shadow-[0_0_8px_#10B981]"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white font-medium">Escrow payout of $145.00 cleared successfully</span>
                <span className="text-[9px] text-neutral-500 font-semibold">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Stats / Snapshot Row */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
          <h3 className="text-[10px] uppercase font-bold text-[#BFA76A] tracking-[0.2em]">Today's Dispatch Snapshot</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Bookings</span>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{bookings.total}</p>
          </div>

          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Active Revenue</span>
            <p className="text-lg font-bold text-emerald-400 tracking-tight mt-0.5">${totalRevenue.toLocaleString('en', { maximumFractionDigits: 0 })}</p>
          </div>

          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Completed Trips</span>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{bookings.completed}</p>
          </div>

          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Cancelled Trips</span>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">{bookings.cancelled}</p>
          </div>

          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Drivers Online</span>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">14 Drivers</p>
          </div>

          <div className="bg-[#0B0B0B]/80 border border-neutral-850 p-4 rounded-xl flex flex-col gap-1 hover:border-gold/15 transition select-none">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Vehicles Active</span>
            <p className="text-lg font-bold text-white tracking-tight mt-0.5">8 Active</p>
          </div>
        </div>
      </div>

      {/* 7. Recent Exports History Board */}
      <div className="card border border-gold/10 bg-[#121212]/30 backdrop-blur-md p-6 rounded-[24px] shadow-lg relative overflow-hidden group text-left mt-6 no-print">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
        <div className="border-b border-neutral-900/60 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
              <History className="w-4 h-4 text-gold" style={{ color: 'var(--color-accent, #BFA76A)' }} /> Recent Administrative Exports
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">Access history log of generated operational audits and file downloads</p>
          </div>
        </div>

        {recentExports.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center italic">No exports recorded in current session history.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 border-b border-neutral-900 pb-2">
                  <th className="py-2.5">Filename</th>
                  <th className="py-2.5">Report Type</th>
                  <th className="py-2.5">Format</th>
                  <th className="py-2.5">Generated By</th>
                  <th className="py-2.5">Date Created</th>
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentExports.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-950 hover:bg-neutral-900/35 transition">
                    <td className="py-3 font-semibold text-white truncate max-w-[200px]" title={item.filename}>{item.filename}</td>
                    <td className="py-3 text-neutral-300">{item.reportType}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        item.format === 'CSV' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                          : item.format === 'XLS' || item.format === 'XLSX'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
                      }`}>
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-400">{item.generatedBy}</td>
                    <td className="py-3 text-neutral-400">{item.date}</td>
                    <td className="py-3 text-neutral-500 font-mono">{item.size}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDownloadAgain(item)}
                          className="px-2.5 py-1 border border-gold/20 hover:border-gold/50 bg-gold/5 hover:bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-wider rounded-lg transition duration-200 cursor-pointer"
                        >
                          Re-download
                        </button>
                        <button
                          onClick={() => handleDeleteHistoryItem(item.id)}
                          className="p-1 hover:bg-neutral-900 rounded text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 8. Export Options Configuration Modal Overlay */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full sm:max-w-[760px] h-full sm:h-auto max-h-full sm:max-h-[90vh] border border-[#2A2A2A] hover:border-gold/20 bg-[#0c0c0c]/98 p-6 sm:p-8 rounded-none sm:rounded-3xl flex flex-col gap-6 shadow-[0_16px_50px_rgba(0,0,0,0.85)] relative overflow-y-auto select-none">
            {/* Top gold accent gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

            {/* Header block */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4 shrink-0">
              <div className="text-left">
                <h2 className="text-lg sm:text-xl font-serif text-gold tracking-widest uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" style={{ color: 'var(--color-accent, #BFA76A)' }} /> Export Operational Audit
                </h2>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Configure, customize, and compile administrative report buffers</p>
              </div>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-[#9CA3AF] hover:text-white transition duration-200 p-1.5 hover:bg-neutral-900 rounded-full cursor-pointer"
                aria-label="Close export modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {exportingState === 'generating' ? (
              /* Generating state */
              <div className="flex flex-col items-center justify-center py-16 gap-6 flex-1">
                <Loader2 className="w-10 h-10 text-gold animate-spin" style={{ color: 'var(--color-accent, #BFA76A)' }} />
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <h3 className="text-white font-bold text-sm tracking-wide animate-pulse">Compiling Report Buffer</h3>
                  <p className="text-[10px] text-neutral-400 font-mono">{progressMsg}</p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-[320px] h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                  <div 
                    className="h-full bg-gold transition-all duration-300 rounded-full"
                    style={{ width: `${exportProgress}%`, backgroundColor: 'var(--color-accent, #BFA76A)' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gold/80 font-mono tracking-widest">{exportProgress}%</span>
              </div>
            ) : exportingState === 'success' ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center py-12 gap-5 text-center flex-1">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-scaleUp">✓</div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-white font-bold text-sm tracking-wide">Report Generated Successfully</h3>
                  <p className="text-[10px] text-neutral-400 max-w-[280px] leading-relaxed">
                    The report has been saved to your local session exports. If the download did not begin automatically, click the button below.
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4 w-full max-w-[240px]">
                  <button
                    onClick={async () => {
                      let blob;
                      if (exportFormat === 'csv') {
                        blob = generateCSV(exportReportType, lastGeneratedFilename);
                      } else if (exportFormat === 'xlsx') {
                        blob = generateExcel(exportReportType, lastGeneratedFilename);
                      } else {
                        blob = generatePDF(exportReportType, lastGeneratedFilename);
                      }
                      const mimeType = getExportMimeType(exportFormat);
                      await saveFile(blob, lastGeneratedFilename, mimeType);
                    }}
                    className="w-full py-2.5 bg-gold text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition shadow-md shadow-gold/20 cursor-pointer"
                    style={{ backgroundColor: 'var(--color-accent, #BFA76A)' }}
                  >
                    Download Again
                  </button>
                  <button
                    onClick={() => setIsExportModalOpen(false)}
                    className="w-full py-2.5 bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-850 transition cursor-pointer"
                  >
                    Dismiss & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Config state */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1 text-left flex-1">
                
                {/* Column 1: Report parameters */}
                <div className="flex flex-col gap-5">
                  
                  {/* Option: Report Type selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">1. Select Report Type</label>
                    <div className="relative">
                      <select
                        value={exportReportType}
                        onChange={(e) => setExportReportType(e.target.value)}
                        className="w-full bg-[#121212] border border-gold/15 text-white text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-gold/50 cursor-pointer transition appearance-none"
                      >
                        <option value="bookings">Bookings Report (Ride history, status logs, fares)</option>
                        <option value="payments">Payments Report (Transaction history, ledger details)</option>
                        <option value="drivers">Drivers Report (Chauffeur dispatch records, contribution)</option>
                        <option value="travelers">Travelers Report (Roster activity, profile logs)</option>
                        <option value="custom">Custom Trips Report (Bespoke dispatch requests, bids)</option>
                        <option value="full">Full System Operations Audit (Consolidated ledger sheets)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gold/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Option: Format Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">2. Document Output Format</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setExportFormat('csv')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                          exportFormat === 'csv'
                            ? 'border-gold bg-gold/10 text-white font-bold'
                            : 'border-neutral-900 bg-[#121212] text-neutral-400 hover:text-white hover:border-neutral-800'
                        }`}
                        style={{ borderColor: exportFormat === 'csv' ? accent : undefined, backgroundColor: exportFormat === 'csv' ? `${accent}10` : undefined }}
                      >
                        <FileText className="w-5 h-5 text-blue-400 shrink-0 mb-1" />
                        <span className="text-[10px] font-bold">CSV</span>
                        <span className="text-[8px] text-neutral-500 font-light mt-0.5">Raw table</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExportFormat('xlsx')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                          exportFormat === 'xlsx'
                            ? 'border-gold bg-gold/10 text-white font-bold'
                            : 'border-neutral-900 bg-[#121212] text-neutral-400 hover:text-white hover:border-neutral-800'
                        }`}
                        style={{ borderColor: exportFormat === 'xlsx' ? accent : undefined, backgroundColor: exportFormat === 'xlsx' ? `${accent}10` : undefined }}
                      >
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mb-1" />
                        <span className="text-[10px] font-bold">EXCEL</span>
                        <span className="text-[8px] text-neutral-500 font-light mt-0.5">Multi-sheet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExportFormat('pdf')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                          exportFormat === 'pdf'
                            ? 'border-gold bg-gold/10 text-white font-bold'
                            : 'border-neutral-900 bg-[#121212] text-neutral-400 hover:text-white hover:border-neutral-800'
                        }`}
                        style={{ borderColor: exportFormat === 'pdf' ? accent : undefined, backgroundColor: exportFormat === 'pdf' ? `${accent}10` : undefined }}
                      >
                        <Award className="w-5 h-5 text-rose-400 shrink-0 mb-1" />
                        <span className="text-[10px] font-bold">PDF</span>
                        <span className="text-[8px] text-neutral-500 font-light mt-0.5">Branded page</span>
                      </button>
                    </div>
                  </div>

                  {/* Option: Date range configuration */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">3. Temporal Scope</label>
                    <div className="relative">
                      <select
                        value={exportDateRange}
                        onChange={(e) => setExportDateRange(e.target.value)}
                        className="w-full bg-[#121212] border border-gold/15 text-white text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-gold/50 cursor-pointer transition appearance-none"
                      >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="thismonth">This Month</option>
                        <option value="lastmonth">Last Month</option>
                        <option value="thisyear">This Year</option>
                        <option value="custom">Custom Date Range</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gold/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {exportDateRange === 'custom' && (
                      <div className="grid grid-cols-2 gap-3 mt-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Start Date</span>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="bg-[#121212] border border-neutral-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">End Date</span>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="bg-[#121212] border border-neutral-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold/50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Options and naming */}
                <div className="flex flex-col gap-5">
                  {/* Option: Checkboxes Options */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">4. Content Modules Formatting</label>
                    <div className="bg-[#121212] border border-neutral-850 p-4 rounded-2xl flex flex-col gap-3">
                      <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exportOptions.summary}
                          onChange={(e) => setExportOptions({ ...exportOptions, summary: e.target.checked })}
                          className="w-3.5 h-3.5 accent-gold cursor-pointer"
                        />
                        <span>Include Executive Summary Metrics</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exportOptions.charts}
                          onChange={(e) => setExportOptions({ ...exportOptions, charts: e.target.checked })}
                          className="w-3.5 h-3.5 accent-gold cursor-pointer"
                        />
                        <span>Include Chart Analysis Models</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exportOptions.detailed}
                          onChange={(e) => setExportOptions({ ...exportOptions, detailed: e.target.checked })}
                          className="w-3.5 h-3.5 accent-gold cursor-pointer"
                        />
                        <span>Include Detailed Ledger Records</span>
                      </label>
                    </div>
                  </div>

                  {/* Option: Active Filters parameters */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">5. Active View Filters</label>
                    <div className="bg-[#121212] border border-neutral-850 p-4 rounded-2xl flex flex-col gap-3">
                      <div className="flex flex-col text-xs gap-1 border-b border-neutral-900 pb-2 text-neutral-400">
                        <span>Chauffeur: <strong className="text-white font-semibold">{driverFilter}</strong></span>
                        <span>Date Range: <strong className="text-white font-semibold">{dateRange}</strong></span>
                      </div>
                      
                      <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={useCurrentFilters}
                          onChange={(e) => setUseCurrentFilters(e.target.checked)}
                          className="w-3.5 h-3.5 accent-gold cursor-pointer"
                        />
                        <span>Apply detected active filter rules</span>
                      </label>
                    </div>
                  </div>

                  {/* Option: Filename */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">6. Filename Specifier</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="TaxiTrio_Report_Name"
                        value={customFilename}
                        onChange={(e) => setCustomFilename(e.target.value)}
                        className="w-full bg-[#121212] border border-neutral-800 text-white text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-gold/50"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-neutral-500 tracking-wider font-mono">
                        .{getExportExtension(exportFormat)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {exportingState === 'idle' && (
              /* Footer action triggers */
              <div className="flex items-center justify-end gap-3 border-t border-neutral-900 pt-4 shrink-0 select-none">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={exportingState !== 'idle'}
                  onClick={handleGenerateReport}
                  className="px-5 py-2.5 bg-gold text-black text-xs uppercase font-bold tracking-wider rounded-xl hover:opacity-90 transition shadow-md shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: 'var(--color-accent, #BFA76A)' }}
                >
                  Generate Report
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
