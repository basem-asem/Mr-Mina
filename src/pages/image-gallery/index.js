import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Plus } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getStaticData } from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "src/views/Alert/AlertMessage";
import DeleteImage from "src/views/dailogs/DeleteImage";
import ImageGalleryForm from "src/views/forms/ImageGalleryForm";

const index = () => {
    const [allImages, setAllImages] = useState();
    const [ImageRef, setImageRef] = useState();
    const [loading, setLoading] = useState(true);
    const [showPop, setShowPop] = useState(false);
    const [deleteImage, setDeleteImage] = useState();
    const [deleteid, setDeleteid] = useState();
    const [open, setOpen] = useState();
    const [Alertpop, setAlertpop] = useState({
        open: false,
        message: "",
    });
    const { t } = useTranslation();

    // delete Image
    const handleDelete = async () => {
        await deleteDoc(doc(db, "ImageGallary", deleteid)).then(() => {
            setShowPop(false);
            //Delete Alert
            setAlertpop({
                open: true,
                message: t("data.delete"),
            });
        });
    };

    // image select for preview or delete
    const handleImageClick = (id, url) => {
        setDeleteImage(url);
        setDeleteid(id);
        setShowPop(true);
    };

    useEffect(() => {
        getStaticData("ImageGallary").then((allimages) => {
            setAllImages(allimages);
            setLoading(false);
        });
    }, [showPop, open]);

    return (
        <>
            <Grid container spacing={6} justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">{t("navbar.Image Gallery")}</Typography>
                </Grid>
                <Grid item textAlign="right" sx={{ marginBottom: 4 }}>
                    <Button variant="contained" onClick={(e) => setOpen(true)}>
                        <Plus sx={{ marginRight: 1.5 }} />
                        {t("imagegallery.page.btn.add")}
                    </Button>
                </Grid>
            </Grid>

            {loading ? (
                <Grid item xs={12} textAlign="center">
                    <CircularProgress />
                </Grid>
            ) : //check articles length
                !allImages.length ? (
                    <Grid item xs={12} textAlign="center">
                        <Typography variant="h5">{t("NoRecord")} </Typography>
                    </Grid>
                ) : (
                    //return Article data in card
                    <Grid container spacing={6}>
                        {allImages?.map((value, index) => (
                            <Grid item xs={12} md={4} lg={3} textAlign="center" key={index}>
                                <img
                                    src={value.image}
                                    alt="preview of seleted image"
                                    height={200}
                                    width="100%"
                                    style={{ borderRadius: "10px" }}
                                    onClick={() => handleImageClick(value.docid, value.image)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

            {/* Dialog for delete Image */}
            <DeleteImage
                deleteImage={deleteImage}
                handleDelete={handleDelete}
                setShowPop={setShowPop}
                showPop={showPop}
            />

            <ImageGalleryForm open={open} setOpen={setOpen} ImageRef={ImageRef} />

            <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
        </>
    );
};

export default index;
