import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Book, Brain, FileText, Lightbulb, PenTool, Star, Users } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your AI-powered academic assistant hub
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Papers Written</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Tools Used</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 active now
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +15% this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>
              Your weekly academic activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2">
              {[40, 25, 45, 30, 60, 75, 65, 45, 50, 65, 70, 80].map((height, i) => (
                <div
                  key={i}
                  className={`bg-primary/10 hover:bg-primary/20 rounded-md w-full transition-colors h-[${height}%]`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Learning Milestones</CardTitle>
            <CardDescription>
              Your academic achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Research Papers</p>
                  <Progress value={80} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Essay Writing</p>
                  <Progress value={65} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Study Goals</p>
                  <Progress value={45} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Tools</CardTitle>
            <CardDescription>
              Quick access to academic tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/tools/writing">
                <PenTool className="h-4 w-4" />
                Essay Assistant
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/tools/research">
                <FileText className="h-4 w-4" />
                Research Helper
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/tools/study">
                <Brain className="h-4 w-4" />
                Study Planner
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Latest Updates</CardTitle>
            <CardDescription>New features and tool updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New AI Writing Assistant",
                  description: "Enhanced essay writing features with better grammar suggestions.",
                  time: "2 hours ago"
                },
                {
                  title: "Study Planner Update",
                  description: "New AI-powered study schedule optimization.",
                  time: "5 hours ago"
                },
                {
                  title: "Research Tool Enhancement",
                  description: "Improved citation generator and source finder.",
                  time: "1 day ago"
                }
              ].map((update, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{update.title}</p>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{update.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Features</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
