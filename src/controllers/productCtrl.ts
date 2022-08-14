import { APIfeatures } from "../lib/features";
import Products from "../models/productModel";
import {Request, Response} from 'express';

const productCtr = {
  getProducts: async (req: Request, res: Response) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
      .paginating().sorting().searching().filtering();

      const counting = new APIfeatures(Products.find(), req.query)
      .searching().filtering().counting();

      const result = await Promise.allSettled([
        features.query,
        // Products.countDocuments()
        counting.query
      ])

      const products = result[0].status === 'fulfilled' ? result[0].value : [];
      const count = result[1].status === 'fulfilled' ? result[1].value : 0;

      return res.status(200).json({products, count});
    } catch (error:any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getProduct: async (req: Request, res: Response) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: "This product does not exist" });
      }

      return res.status(200).json(product);
    } catch (error:any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addProduct: async (req: Request, res: Response) => {
    try {
      const { title, price, description, category, image } = req.body;

      const newProduct = new Products({
        title,
        price,
        description,
        category,
        image,
      });
      await newProduct.save();

      return res.status(200).json(newProduct);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req: Request, res: Response) => {
    try {
      const { title, price, description, category, image } = req.body;

      const product = await Products.findByIdAndUpdate(
        req.params.id,
        {
          title,
          price,
          description,
          category,
          image,
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ msg: "This product does not exist" });
      }

      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await Products.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: "This product does not exist" });
      }

      return res.status(200).json({ msg: "Delete Succeess!" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default productCtr;
