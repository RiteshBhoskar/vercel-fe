"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "./Header"
import { RocketIcon } from "lucide-react"
import { CopyButton } from "./ui/shadcn-io/copy-button"
import { Vortex } from "./ui/shadcn-io/vortex"

const BACKEND_UPLOAD_URL = "http://vercel.riteshbhoskar.com";

export function LandingPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [status, setStatus] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");

  useEffect(() => {
    if (uploadId) {
      const url = `https://${uploadId}.vercel.riteshbhoskar.com/`
      setDeployedUrl(url);
    }
  }, [uploadId]);


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
    return "Deploy";
  };

  return (
    <div className="h-screen w-full  flex-col  items-center">
      <Vortex
        backgroundColor="black"
        particleCount={300}
        rangeY={200}
        baseHue={100}
        baseSpeed={0.0}
        rangeSpeed={1}
        className="absolute inset-0 z-0 h-full w-full"
        >
      <Header />
      <div className="flex flex-col items-center mt-7 w-full justify-center px-4 sm:px-20 ">
        <Card className="border-border bg-card w-full h-full my-8 py-10">
          <div className="sm:mx-auto mx-2 max-w-2xl">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-foreground">Deploy from GitHub</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your React GitHub repository URL to create a new deployment
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="h-12 bg-background"
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
            }} disabled={ uploadId !== "" || uploading}                 className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90" type="submit">
              <RocketIcon className="mr-2 h-4 w-4" />
              {getButtonText()}
            </Button>
            </div>
          </div>
        </Card>

            {uploadId && !deployed && 
            (
        <Card className="w-full flex flex-col items-center justify-center px-2 mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Deployment Status</CardTitle>
            <CardDescription>{status}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {deployed && 
      <Card className="max-w-lg w-full py-10 my-8 items-center flex flex-col text-center justify-center">
        <CardHeader className="w-full">
          <CardTitle className="text-2xl">Deployment Successful</CardTitle>
          <CardDescription>Your website is successfully deployed!</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="space-y-2">
            <Label htmlFor="deployed-url">Deployed URL</Label>
            <div className="flex gap-2">
              <Input id="deployed-url" readOnly type="url" value={deployedUrl} />
              <CopyButton content={deployedUrl} />
            </div>
          </div>
          <br />
          <Button className="w-full" variant="outline">
            <a href={`https://${uploadId}.vercel.riteshbhoskar.com/`} className="w-full h-10 flex items-center justify-center" target="_blank">
              Visit Website
            </a>
          </Button>
          <br />
            <Button
              className="w-full mt-4 h-10 text-sm"
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
      </div>
      </Vortex>
    </div>
  )
}