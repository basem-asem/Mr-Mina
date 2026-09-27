import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot,query,where,getDocs,writeBatch } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";

// ** MUI Imports
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { Delete, Pencil, Plus } from "mdi-material-ui";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardActionArea,
} from "@mui/material";
import SubCategory from "./SubCategory";
import Categoryform from "./Categoryform";
import { CircularProgress } from "@mui/material";
import AlertMessage from "src/views/Alert/AlertMessage";
import useTranslation from "src/@core/hooks/useTranslation";
import { useRouter } from "next/router";

function Category() {
  const router = useRouter();
  // ** State
  const [Categories, setCategories] = useState([]);
  const [Subcategory, setSubcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPop, setShowPop] = useState(false);
  const [SubcategoryId, setSubcategoryId] = useState("");
  const [CategoriesId, setCategoriesId] = useState("");
  const [collapse, setCollapse] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSubService, setOpenSubService] = useState(false);
  const [CategoriesEditId, setCategoriesEditId] = useState();
  const [SubcategoryEditId, setSubcategoryEditId] = useState();
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation(router?.locale);

  // Function for open Servcie Add/Edit popup
  const handleClickOpen = (_, id) => {
    setCategoriesEditId(id);
    setOpen(true);
  };

  // Function for open Sub Servcie Add/Edit popup
  const handleClickSubserviceOpen = (_, CategoryId, id) => {
      setCategoriesEditId(CategoryId);
      setSubcategoryEditId(id);
      setOpenSubService(true);
    
  };

  // Function for close popup
  const handleClose = () => {
      setOpenSubService(false);
      setOpen(false);
      setCategoriesEditId();
      setSubcategoryEditId();
  };

  // function for delete Service details
const handleDelete = async () => {
  if (CategoriesId) {
    const batch = writeBatch(db);

    // Delete the main category document
    const categoryDocRef = doc(db, "categories", CategoriesId);
    batch.delete(categoryDocRef);

    // Delete subcollections for each category
    const categoryQuerySnapshot = await getDocs(collection(db, "categories", CategoriesId, "requests"));
    categoryQuerySnapshot.forEach((docs) => {
      const subcollectionRef = doc(db, "categories", CategoriesId, "requests", docs.id);
      batch.delete(subcollectionRef);
    });

    // Commit the batched delete operation
    await batch.commit().then(() => {
      setShowPop(false);
      // Delete Alert
      setAlertpop({
        open: true,
        message: t("delete.deletesuccess"),
      });
    });
  }
};

const handleSubcollectionDelete = async (categoryId, subcategoryId) => {
  const subcollectionRef = doc(db, "categories", categoryId, "requests", subcategoryId);
  await deleteDoc(subcollectionRef).then( () => {
    // Commit the batched delete operation
      setShowPop(false);
      // Delete Alert
      setAlertpop({
        open: true,
        message: t("delete.deletesuccess"),
      });
    // Update state or perform any necessary actions
    console.log("Subcollection deleted successfully");
  }).catch(error => {
    console.error("Error deleting subcollection: ", error);
  });
};

  // function for close delete popup
  const handlePopclose = () => {
    setShowPop(false);
  };

  // function for open delete popup
  const handlePopopen = (serviceid, id) => {
    setCategoriesId(serviceid);
    setSubcategoryId(id);
    setShowPop(true);
  };
  
  useEffect(() => {
    const fetchAllService = async () => {
      const categoryQuery = collection(db, "categories");
      await onSnapshot(categoryQuery, async (categorySnapshot) => {
        const categoryarr = [];
        for (const category of categorySnapshot.docs) {
          const categorydata = category.data();
          categorydata.id = category.id;
          
          // Listen to changes in requests for the current city
          const requestsRef = collection(db, "categories", category.id, "requests");
          const unsubscribe = onSnapshot(requestsRef, (requestsSnapshot) => {
            const requestsData = requestsSnapshot.docs.map(area => ({ ...area.data(), id: area.id }));
            categorydata.requests = requestsData;
            setCategories((prevCategories) => {
              // Update only the category that has changed
              return prevCategories.map((prevCategory) => {
                if (prevCategory.id === categorydata.id) {
                  return categorydata;
                }
                return prevCategory;
              });
            });
          });
  
          categoryarr.push(categorydata);
        }
        setCategories(categoryarr);
        setIsLoading(false);
      });
    };    
    fetchAllService();
  }, []);
  

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5">{t("navbar.Hotels Category")}</Typography>
        </Grid>
        <Grid item xs={12} md={9} textAlign="right" sx={{ marginBottom: 4 }}>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{ marginRight: 1.5 }}
          >
            <Plus sx={{ marginRight: 1.5 }} /> {t("cities.newCity")}
          </Button>
          <Button variant="contained" onClick={handleClickSubserviceOpen}>
            <Plus sx={{ marginRight: 1.5 }} /> {t("cities.newArea")}
          </Button>
        </Grid>
        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        ) : Categories.length == 0 ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ marginTop: 5 }}>
            {t("cities.noCity")}
            </Typography>
          </Grid>
        ) : (
          <SimpleTreeView>
          {Categories.map((value, index) => (
  // Inside the SimpleTreeView component:
<TreeItem
  itemId={value.nameEN}
  label={
    <div style={{ display: "flex", alignItems: "center", justifyContent:"space-between", gap:"5px" }}>
      <Typography>
        {router.locale === "ar" ? value.nameAR : value.nameEN}
      </Typography>
      <div style={{ display: "flex", justifyContent:"center" }}>
      <Button
      style={{minWidth: "0"}}
        onClick={(e) => {
          handleClickOpen(e, value.id);
        }}
        >
        <Pencil
          titleAccess="Edit Category"
          htmlColor="blue"
          />
      </Button>
      <Button
      style={{minWidth: "0"}}
        onClick={() => {
          handlePopopen(value.id);
        }}
        >
        <Delete titleAccess="Delete Category" htmlColor="red" />
      </Button>
        </div>
    </div>
  }
  key={index}
>
  {value.requests && value.requests.map((val, i) => (
    <TreeItem
      itemId={`${i} ${val.areaEN}`}
      label={
        <div style={{ display: "flex", alignItems: "center", gap:"5px" }}>
          <Typography>
            {router.locale === "ar" ? val.areaAR : val.areaEN}
          </Typography>
          <Button
      style={{minWidth: "0"}}
        onClick={(e) => {
          handleClickSubserviceOpen(e, value.id,val.id);
        }}
        >
        <Pencil
          titleAccess="Edit Category"
          htmlColor="blue"
          />
      </Button>
          <Button
      style={{minWidth: "0", padding:"0"}}
            onClick={() => {
              handleSubcollectionDelete(value.id, val.id);
            }}
          >
            <Delete titleAccess="Delete Subcategory" htmlColor="red" />
          </Button>
        </div>
      }
      key={i}
    />
  ))}
</TreeItem>

))}

        </SimpleTreeView>
        
        )}
      </Grid>

      {/* Dialog for delete category */}
      <Dialog
        open={showPop}
        onClose={handlePopclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t("forms.btn.Delete.category")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {t("cities.confirmdelete")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopclose}>{t("dailog.btn.disagree")}</Button>
          <Button onClick={handleDelete} autoFocus>
          {t("dailog.btn.agree")}
          </Button>
        </DialogActions>
      </Dialog>

      <Categoryform
        handleClose={handleClose}
        open={open}
        CategoriesEditId={CategoriesEditId}
      />

      <SubCategory
        handleClose={handleClose}
        openSubService={openSubService}
        Categories={Categories}
        SubcategoryId={SubcategoryId}
        SubcategoryEditId={SubcategoryEditId}
        CategoriesEditId={CategoriesEditId}
        suppliers={Subcategory}
      />
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </div>
  );
}

export default Category;