"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

const BACKEND_UPLOAD_URL = "http://vercel.riteshbhoskar.com";

export function LandingPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [status, setStatus] = useState("");



  const handleDeployAnother = () => {
    setRepoUrl("");
    setUploadId("");
    setUploading(false);
    setDeployed(false);
    setStatus("");
  };

  const getButtonText = () => {
    if (deployed) {
      return "Deploy Another";
    } else if (uploading) {
      return "Uploading...";
    } else if (uploadId && status === "Deployment Failed") {
      return "Deploy Again";
    }
    return "Upload";
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-300 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Deploy your GitHub Repository</CardTitle>
          <CardDescription>Enter the URL of your GitHub repository to deploy it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input 
                value={repoUrl || ""}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                }}
                placeholder="https://github.com/username/repo" 
              />
            </div>
            <Button onClick={async () => {
              setUploading(true);
              const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
                repoUrl: repoUrl
              });
              setUploadId(res.data.id);
              setUploading(false);
              const interval = setInterval(async () => {
                const response = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`);
                const currentStatus = response.data.status;

                setStatus(currentStatus);

                if(currentStatus === "Deployment Complete"){
                  clearInterval(interval);
                  setDeployed(true);
                }

                if(currentStatus === "Deployment Failed"){
                  clearInterval(interval);
                  setDeployed(false)
                }

              }, 3000)
            }} disabled={uploadId !== "" || uploading} className="w-full" type="submit">
              {getButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>
            {uploadId && !deployed && (
        <Card className="w-full max-w-md mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Deployment Status</CardTitle>
            <CardDescription>{status}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {deployed && <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Deployment Status</CardTitle>
          <CardDescription>Your website is successfully deployed!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deployed-url">Deployed URL</Label>
            <Input id="deployed-url" readOnly type="url" value={`http://${uploadId}.vercel.riteshbhoskar.com/`} />
          </div>
          <br />
          <Button className="w-full" variant="outline">
            <a href={`http://${uploadId}.vercel.riteshbhoskar.com/`} target="_blank">
              Visit Website
            </a>
          </Button>
          <br />
            <Button
              className="w-full mt-4"
              onClick={handleDeployAnother}
              variant="outline"
            >
              Deploy Another
            </Button>
        </CardContent>
      </Card>}

      {status === "Deployment Failed" && (
        <Card className="w-full max-w-md mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Deployment Failed</CardTitle>
            <CardDescription>Deployment failed. Please try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={handleDeployAnother}
              variant="outline"
            >
              Deploy Again
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}