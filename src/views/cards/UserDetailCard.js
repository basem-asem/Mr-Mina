import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from 'react-redux';
import { setTrue, setFalse } from 'src/redux/features/PrintingSlice';
import { Chip, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const Detail = ({ label, userDetails }) => {
  return (
    <TableRow 
    sx={{ '&:last-child td, &:last-child th': { border: 0 }, border:"1px solid #eee" }}
    >
      <TableCell sx={{borderRight:"1px solid #eee"}}>{label}:</TableCell>
      <TableCell>{userDetails}</TableCell>
    </TableRow>
  );
};

const UserDetailCard = forwardRef(({ userDetails }, ref) => {
  const { t } = useTranslation();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const router = useRouter();
  const statusObj = {
    Accepted: { color: "info" },
    Cancelled: { color: "error" },
    Pending: { color: "warning" },
    Completed: { color: "success" },
  };
  const dispatch = useDispatch();


  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const details = navigator.userAgent;
      const regexp = /android|iphone|kindle|ipad/i;
      setIsMobileDevice(regexp.test(details));
    }
  }, []);
console.log(userDetails)
  const downloadPDF = () => {
    dispatch(setTrue())
    // const capture = document.querySelector('.actual-receipt');
    // html2canvas(capture).then((canvas) => {
    //   const imgData = canvas.toDataURL('img/png');
    //   const doc = new jsPDF('landscape', 'mm', 'a4');
    //   const componentWidth = doc.internal.pageSize.getWidth();
    //   const componentHeight = 100;
    //   console.log(componentWidth, componentHeight)
    //   doc.addImage(imgData, 'PNG', 0, 50, componentWidth, componentHeight);
    //   doc.save('receipt.pdf');
    // });
    setTimeout(()=>{
    window.print();

      dispatch(setFalse())
    }, 2000)
  };

  useImperativeHandle(ref, () => ({
    downloadPDF,
  }));

  return (
    <TableContainer>
    <Table>
      <TableBody>
        <Detail label={t("request.guestName")} userDetails={userDetails?.guestName} />
        <Detail label={t("request.guestRM")} userDetails={userDetails?.guestRM} />
        <Detail label={t("request.orderRes")} userDetails={userDetails?.orderRes} />
        <Detail label={t("request.status")} userDetails={
          <Chip
            label={
              router.locale === "en"
                ? userDetails?.status
                : userDetails?.status
                    .replace("Pending", "معلق")
                    .replace("Accepted", "مقبولة")
                    .replace("On its way", "في الطريق اليك")
                    .replace("Delivered", "تم التوصيل")
                    .replace("Completed", "اكتمل")
                    .replace("Canceled", "ملغاة")
            }
            color={statusObj[userDetails?.status]?.color}
            sx={{ height: 24, fontSize: "0.75rem", textTransform: "capitalize", "& .MuiChip-label": { fontWeight: 500 } }}
          />
        } />
        <Detail label={t("request.createdAt")} userDetails={new Date(userDetails?.created_At.seconds * 1000).toLocaleString()} />
        {(userDetails?.status === "Work on it" || userDetails?.status === "Completed") && (
          <Detail label={t("request.responseTime")} userDetails={new Date(userDetails?.responseTime.seconds * 1000).toLocaleString()} />
        )}
        {userDetails?.status === "Completed" && (
          <Detail label={t("request.requestDoneTime")} userDetails={new Date(userDetails?.requestDoneTime.seconds * 1000).toLocaleString()} />
        )}
        {userDetails?.city && (
          <Detail label={t("user-detail.table.city")} userDetails={userDetails?.city} />
        )}
        <Detail label={t("request.orderTaker")} userDetails={userDetails?.orderTaker} />
        <Detail label={t("request.department")} userDetails={router.locale === "en" ? userDetails?.department : userDetails?.departmentAR} />
        <Detail label={t("request.request")} userDetails={router.locale === "en" ? userDetails?.request : userDetails?.requestAR} />
        <Detail label={t("request.guestCalled")} userDetails={userDetails?.guestCalled ? t("request.yes") : t("request.no")} />
        <Detail label={t("request.calles")} userDetails={userDetails?.noCalls == null ? 0 : userDetails?.noCalls} />
        <Detail label={t("request.followUp")} userDetails={userDetails?.followUp == null ? 0 : userDetails?.followUp} />
      </TableBody>
    </Table>
  </TableContainer>
  );
});

export default UserDetailCard;
