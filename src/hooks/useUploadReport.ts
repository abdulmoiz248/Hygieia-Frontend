import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LabTechapi as api } from "@/axios-api/lab-tech"

export function useUploadReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      file,
      reportValues,
      type,
    }: {
      id: string
      file?: File
      reportValues?: any
      type: string
    }) => {
      if (type === "scan") {
        const formData = new FormData()
        if (file) formData.append("file", file)
        await api.post(`/${id}/upload-scan`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        const body = reportValues
          ? { resultData: reportValues.results, title: file?.name || "Report" }
          : {}
        return api.post(`/${id}/upload-result`, body)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labDashboard"] })
    },
  })
}
