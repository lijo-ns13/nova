// import { useEffect, useState } from "react";
// import BaseModal from "../../modals/BaseModal";
// import { editProject } from "../../../services/ProfileService";
// import { useAppSelector } from "../../../../../hooks/useAppSelector";
// import toast from "react-hot-toast";
// import {
//   UpdateProjectInputDTO,
//   UpdateProjectInputSchema,
// } from "../../../schema/projectSchema";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { handleApiError } from "../../../../../utils/apiError";

// export interface ProjectResponseDTO {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   projectUrl?: string;
//   startDate: string;
//   endDate?: string;
//   technologies: string[];
// }

// interface EditProjectModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   project: ProjectResponseDTO;
//   onProjectUpdated: () => void;
// }

// export default function EditProjectModal({
//   isOpen,
//   onClose,
//   project,
//   onProjectUpdated,
// }: EditProjectModalProps) {
//   const { id } = useAppSelector((state) => state.auth);
//   const [globalError, setGlobalError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     setError,
//     formState: { errors },
//   } = useForm<UpdateProjectInputDTO>({
//     resolver: zodResolver(UpdateProjectInputSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       projectUrl: "",
//       startDate: "",
//       endDate: "",
//       technologies: [""],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "technologies",
//   });

//   useEffect(() => {
//     if (project) {
//       reset({
//         title: project.title,
//         description: project.description,
//         projectUrl: project.projectUrl ?? "",
//         startDate: project.startDate.split("T")[0],
//         endDate: project.endDate?.split("T")[0] ?? "",
//         technologies: project.technologies.length ? project.technologies : [""],
//       });
//     }
//   }, [project, reset]);

//   const onSubmit = async (data: UpdateProjectInputDTO) => {
//     try {
//       await editProject(id, project.id, data);
//       toast.success("Project updated successfully");
//       onProjectUpdated();
//       handleClose();
//     } catch (err: unknown) {
//       const parsed = handleApiError(err, "Failed to update project");
//       setGlobalError(parsed.message ?? "Something went wrong");

//       if (parsed.errors) {
//         Object.entries(parsed.errors).forEach(([key, value]) => {
//           setError(key as keyof UpdateProjectInputDTO, {
//             type: "manual",
//             message: value,
//           });
//         });
//       }
//     }
//   };

//   const handleClose = () => {
//     reset();
//     setGlobalError(null);
//     onClose();
//   };

//   return (
//     <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Project">
//       {globalError && (
//         <p className="text-red-600 text-sm font-medium text-center">
//           {globalError}
//         </p>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <input
//             type="text"
//             {...register("title")}
//             placeholder="Project Title"
//             className="w-full border px-3 py-2 rounded"
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//           )}
//         </div>

//         <div>
//           <textarea
//             {...register("description")}
//             placeholder="Description"
//             className="w-full border px-3 py-2 rounded"
//             rows={4}
//           />
//           {errors.description && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.description.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <input
//             type="url"
//             {...register("projectUrl")}
//             placeholder="Project URL (optional)"
//             className="w-full border px-3 py-2 rounded"
//           />
//           {errors.projectUrl && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.projectUrl.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <input
//             type="date"
//             {...register("startDate")}
//             className="w-full border px-3 py-2 rounded"
//           />
//           {errors.startDate && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.startDate.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <input
//             type="date"
//             {...register("endDate")}
//             className="w-full border px-3 py-2 rounded"
//           />
//           {errors.endDate && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.endDate.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Technologies</label>
//           {fields.map((field, index) => (
//             <div key={field.id} className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 {...register(`technologies.${index}` as const)}
//                 className="flex-1 border px-3 py-2 rounded"
//               />
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className="text-red-500 font-semibold"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => append("")}
//             className="text-blue-500 text-sm font-medium"
//           >
//             + Add Technology
//           </button>
//           {errors.technologies && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.technologies.message as string}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
//         >
//           Update Project
//         </button>
//       </form>
//     </BaseModal>
//   );
// }
