import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "src/configs/firebaseConfig";
import {
  setArabicTrans,
  setEnglishTrans,
} from "src/redux/features/TranslationSlice";

function useTranslation() {
  const { en, ar } = useSelector((state) => state.Translation);
  const dispatch = useDispatch();
  const { locale } = useRouter();

  const data = async () => {
    const Translation = query(collection(db, "Translation"));
    const querySnapshot = await getDocs(Translation);

    querySnapshot.forEach((doc) => {
      if (doc.id == "English") {
        dispatch(setEnglishTrans(doc.data().english));
      } else {
        dispatch(setArabicTrans(doc.data().arabic));
      }
    });
  };

  useEffect(() => {
    data();
  }, []);

  const t = (key) => {
    // const arbic = JSON.parse(ar)
    // const english = JSON.parse(en)
    if (locale == "ar") {
      return ar[key];
    }
    if (locale == "en" || !locale) {
      return en[key];
    }
  };

  return { t };
}

export default useTranslation;
