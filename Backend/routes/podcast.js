import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addView, addepisodes, createPodcast, favoritPodcast, getByCategory, getByTag, getPodcastById, getPodcasts, random, search, mostpopular } from "../controllers/podcasts.js";


const router = express.Router();


router.post("/",verifyToken, createPodcast);

router.get("/", getPodcasts);

router.get("/get/:id",getPodcastById)

 
router.post("/episode",verifyToken, addepisodes);


router.post("/favorite",verifyToken,favoritPodcast); 


router.post("/addview/:id",addView); 



router.get("/mostpopular", mostpopular)
router.get("/random", random)
router.get("/tags", getByTag)
router.get("/category", getByCategory)
router.get("/search", search)





export default router;