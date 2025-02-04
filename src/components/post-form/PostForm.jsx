import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import appwriteService from "../../appwrite/config.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// This functional component accepts a post prop.
// If post is provided, it means the user is editing an existing post.
// If post is undefined, the user is creating a new post.
export default function PostForm({ post }) {
  // while using useForm we don't need to manage many states for input fields
  // For More - https://react-hook-form.com/docs/useform
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "Active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    // If post exists, update the existing post.
    if (post) {
      // Uploads a new image if provided.
      const file = data.featuredImage[0]
        ? await appwriteService.uploadFile(data.featuredImage[0])
        : null;

      // Deletes the old image (if a new one is uploaded).
      if (file) {
        await appwriteService.deletFile(post.featuredImage);
      }

      // Updates the post in the database
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      // if the post is updated successfully then i will redirect the user
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    }
    // If post does not exist, create a new post.
    else {
      // Uploads an image to Appwrite.
      const file = await appwriteService.uploadFile(data.featuredImage[0]);

      if (file) {
        const fileId = file.$id;
        // Stores the image's fileId in data.featuredImage.
        data.featuredImage = fileId;
        // Saves the post to the database.
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) {
          // Redirects to the newly created post.
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace("/[^a-zA-Zds]+/g", "-") // Remove special characters
        .replace(/\s/g, "-"); // Replace spaces with hyphens
    }
  }, []);

  React.useEffect(() => {
    // Watches the title field
    watch((value, { name }) => {
      if (name === "title") {
        // Automatically updates the slug field in real-time.
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap ">
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Title"
          className="mb-4 "
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{ required: "Content is required" }}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg"
          {...register("featuredImage", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["Active", "Inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
