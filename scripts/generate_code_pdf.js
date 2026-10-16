import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function generatePDF() {
  console.log('Generating PDF of project codes...');

  const pdfDoc = await PDFDocument.create();
  const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28; // A4 width in pt
  const PAGE_HEIGHT = 841.89; // A4 height in pt
  const MARGIN = 36;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const FONT_SIZE = 8;
  const LINE_HEIGHT = 10.5;
  const LINES_PER_PAGE = Math.floor((PAGE_HEIGHT - MARGIN * 2 - 30) / LINE_HEIGHT);

  // 1. Cover Page
  let coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(0.08, 0.08, 0.08)
  });

  coverPage.drawText('STUDSPOT KENYA', {
    x: MARGIN,
    y: PAGE_HEIGHT - 120,
    size: 28,
    font: fontHelveticaBold,
    color: rgb(0.95, 0.72, 0.11) // #F3B71B
  });

  coverPage.drawText('Complete Source Code & Architecture Documentation', {
    x: MARGIN,
    y: PAGE_HEIGHT - 150,
    size: 14,
    font: fontHelvetica,
    color: rgb(0.9, 0.9, 0.9)
  });

  coverPage.drawText('Campus Peer-to-Peer Marketplace & Student Community Platform', {
    x: MARGIN,
    y: PAGE_HEIGHT - 170,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.65, 0.65, 0.65)
  });

  coverPage.drawText('Project Details:', {
    x: MARGIN,
    y: PAGE_HEIGHT - 240,
    size: 12,
    font: fontHelveticaBold,
    color: rgb(0.95, 0.72, 0.11)
  });

  const metadataLines = [
    '• Framework: React 19 (TypeScript) + Vite',
    '• Styling: Tailwind CSS (Mobile-First Responsive)',
    '• Iconography: Lucide React Icons',
    '• Platforms: PWA (Progressive Web App) + Web (Vercel Ready)',
    '• Official Merchant Till: 1823325 (STUDSPOT KENYA)',
    '• Key Features: Feed, Sold Archival, Safe Campus Spots, Chat, Admin Moderation',
    `• Generated: ${new Date().toLocaleDateString('en-KE', { dateStyle: 'full' })}`
  ];

  let metaY = PAGE_HEIGHT - 265;
  for (const line of metadataLines) {
    coverPage.drawText(line, {
      x: MARGIN + 10,
      y: metaY,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.8, 0.8, 0.8)
    });
    metaY -= 20;
  }

  // Files to include
  const filePaths = [
    'package.json',
    'vercel.json',
    'vite.config.ts',
    'index.html',
    'src/types/index.ts',
    'src/main.tsx',
    'src/App.tsx',
    'src/components/ListingCard.tsx',
    'src/components/ListingDetailModal.tsx',
    'src/components/TransactionHistoryModal.tsx',
    'src/components/PostListingModal.tsx',
    'src/components/PaymentInstructionScreen.tsx',
    'src/components/InAppChatModal.tsx',
    'src/components/MobileHeader.tsx',
    'src/components/NavigationTabs.tsx',
    'src/components/CampusCategoryFilterBar.tsx',
    'src/components/CampusBuzzFeed.tsx',
    'src/components/AdminApprovalModal.tsx',
    'src/components/SignUpModal.tsx',
    'src/components/StudentVerifyModal.tsx',
    'src/components/MpesaModal.tsx',
    'src/components/SavedModal.tsx',
    'src/components/ShareModal.tsx',
    'src/components/TermsOfServiceModal.tsx',
    'src/components/PWAInstallButton.tsx',
    'src/components/OfflineIndicator.tsx',
    'src/components/StudspotLogo.tsx',
    'src/hooks/usePWAInstall.ts',
    'src/utils/campusStore.ts',
    'src/data/seedData.ts'
  ];

  // Table of Contents Page
  let tocPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let tocY = PAGE_HEIGHT - 50;

  tocPage.drawText('TABLE OF CONTENTS', {
    x: MARGIN,
    y: tocY,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.1, 0.1)
  });
  tocY -= 30;

  for (const f of filePaths) {
    if (tocY < 50) {
      tocPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      tocY = PAGE_HEIGHT - 50;
    }
    tocPage.drawText(f, {
      x: MARGIN + 10,
      y: tocY,
      size: 9,
      font: fontCourier,
      color: rgb(0.2, 0.2, 0.2)
    });
    tocY -= 15;
  }

  let totalPagesCount = 2; // cover + toc

  // Helper to split text into chunks
  for (const relPath of filePaths) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn('File not found:', relPath);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const rawLines = content.split('\n');

    // Wrap lines that exceed content width
    const wrappedLines = [];
    const maxCharsPerLine = 100;
    for (let line of rawLines) {
      line = line.replace(/\t/g, '  ');
      while (line.length > maxCharsPerLine) {
        wrappedLines.push(line.slice(0, maxCharsPerLine));
        line = '  ' + line.slice(maxCharsPerLine);
      }
      wrappedLines.push(line);
    }

    let lineIndex = 0;
    let filePageNum = 1;

    while (lineIndex < wrappedLines.length) {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      totalPagesCount++;

      // Header
      page.drawRectangle({
        x: MARGIN,
        y: PAGE_HEIGHT - 38,
        width: CONTENT_WIDTH,
        height: 18,
        color: rgb(0.95, 0.95, 0.95)
      });

      page.drawText(`File: ${relPath} (Page ${filePageNum})`, {
        x: MARGIN + 6,
        y: PAGE_HEIGHT - 32,
        size: 8,
        font: fontHelveticaBold,
        color: rgb(0.15, 0.15, 0.15)
      });

      page.drawText('STUDSPOT Source Code', {
        x: PAGE_WIDTH - MARGIN - 110,
        y: PAGE_HEIGHT - 32,
        size: 7,
        font: fontHelvetica,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Render lines for this page
      let y = PAGE_HEIGHT - 52;
      const linesForThisPage = wrappedLines.slice(lineIndex, lineIndex + LINES_PER_PAGE);

      for (const codeLine of linesForThisPage) {
        // Safe characters for standard WinAnsiEncoding
        const safeText = codeLine.replace(/[^\x20-\x7E]/g, ' ');
        page.drawText(safeText, {
          x: MARGIN,
          y,
          size: FONT_SIZE,
          font: fontCourier,
          color: rgb(0.15, 0.15, 0.15)
        });
        y -= LINE_HEIGHT;
      }

      // Footer
      page.drawText(`Page ${totalPagesCount}`, {
        x: PAGE_WIDTH / 2 - 15,
        y: 20,
        size: 8,
        font: fontHelvetica,
        color: rgb(0.6, 0.6, 0.6)
      });

      lineIndex += LINES_PER_PAGE;
      filePageNum++;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve(process.cwd(), 'public/STUDSPOT_Complete_Source_Code.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF successfully created at ${outputPath} (${pdfBytes.length} bytes, ~${totalPagesCount} pages)`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
