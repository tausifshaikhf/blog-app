import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { clearServiceError } from "../../store/authSlice.js";
import appwriteService from "../../appwrite/config.js";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import Loader from "../../pages/Loader.jsx";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "Active",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const serviceError = useSelector((state) => state.auth.serviceError);
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    setLoading(true);

    if (serviceError) {
      toast.error(serviceError, { theme: "dark", transition: Bounce });
      setTimeout(() => dispatch(clearServiceError()), 5000);
      setLoading(false);
      return;
    }

    try {
      let fileId = null;
      if (data.featuredImage[0]) {
        const file = await appwriteService.uploadFile(data.featuredImage[0]);
        fileId = file?.$id;
      }

      if (post) {
        if (fileId) await appwriteService.deletFile(post.featuredImage);
        const dbPost = await appwriteService.updatePost(post.$id, { ...data, featuredImage: fileId || post.featuredImage });
        if (dbPost) navigate(`/post/${dbPost.$id}`);
      } else {
        const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id, featuredImage: fileId });
        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }
    } catch (error) {
      toast.error("Something went wrong!", { theme: "dark", transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
  }, [watch, setValue]);

  const slugTransform = (value) =>
    value
      ?.normalize("NFD")
      .replace(/[^a-zA-Z0-9\s]/g, "-")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() || "";

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" transition={Bounce} />
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
          <div className="w-2/3 px-2">
            <Input label="Title" {...register("title", { required: "Title is required", minLength: 10, maxLength: 100 })} />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            <Input label="Slug" {...register("slug", { required: true })} onInput={(e) => setValue("slug", slugTransform(e.target.value), { shouldValidate: true })} />
            <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} rules={{ required: "Content is required" }} />
          </div>
          <div className="w-1/3 px-2">
            <Input label="Featured Image" type="file" accept="image/*" {...register("featuredImage", { required: !post })} />
            {post && <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg" />}
            <Select options={["Active", "Inactive"]} label="Status" {...register("status", { required: true })} />
            <Button type="submit" className="w-full" bgColor={post ? "bg-green-500" : undefined}>{post ? "Update" : "Submit"}</Button>
          </div>
        </form>
      )}
    </>
  );
}
