import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Users,
  Heart,
  Share,
  Copy,
  Delete,
  Edit,
  MoreVertical,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSheetStore } from "@/store/useSheetStore";
import { useEffect } from "react";
// import { userInfo } from "os";

const SheetsPage = () => {
  const navigate = useNavigate();
  const {
    isGettingSheets,
    getAllMySheets,
    getAllPublicSheets,
    mySheets,
    publicSheets,
    deleteSheet,
  } = useSheetStore();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleDelete = (id) => {
    deleteSheet(id);
  };

  const handleEdit = (id) => {
    navigate(`/sheets/create?edit=${id}`);
  };

  const SheetCard = ({
    sheet,
    isOwned = false,
  }: {
    sheet: any;
    isOwned?: boolean;
  }) => (
    <Link to={`/sheet/${sheet.id}`} className="block h-full">
      <Card className="bg-craft-panel border-craft-border hover:border-craft-accent/50 transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-craft-text-primary font-semibold text-lg group-hover:text-craft-accent transition-colors mb-2">
                {sheet.name}
              </h3>
              <p className="text-craft-text-secondary text-sm mb-3">
                {sheet.description}
              </p>
              {sheet.author && (
                <p className="text-craft-text-secondary text-xs">
                  by {sheet.author}
                </p>
              )}
            </div>
            {sheet.userId === userInfo.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-craft-text-secondary hover:text-craft-accent"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-craft-panel border-craft-border">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(sheet.id);
                    }}
                    className="text-craft-text-secondary hover:text-craft-accent hover:bg-craft-bg cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(sheet.id);
                    }}
                    className="text-craft-text-secondary hover:text-red-600 hover:bg-craft-bg cursor-pointer"
                  >
                    <Delete className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {sheet.likes > 0 && (
              <div className="flex items-center space-x-1 text-craft-text-secondary">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{sheet.likes}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {sheet.tags?.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs text-craft-text-secondary border-craft-border"
              >
                {tag}
              </Badge>
            ))}
            {sheet.tags?.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs text-craft-text-secondary border-craft-border"
              >
                +{sheet.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="mt-auto">
            <div className="items-center space-x-4 text-sm">
              <div className="h-2 bg-craft-bg rounded-full overflow-hidden w-full">
                <div
                  className="h-full bg-gradient-to-r from-craft-accent to-craft-accent-secondary"
                  style={{
                    width: `${
                      (sheet.problems.map((problem) =>
                        problem.solvedBy.includes(userInfo.id)
                      ).length /
                        sheet.problems.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-craft-text-secondary text-end pt-1">
                {
                  sheet.problems.map((problem) =>
                    problem.solvedBy.includes(userInfo.id)
                  ).length
                }
                /{sheet.problems.length} solved
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  useEffect(() => {
    if (mySheets) {
      getAllMySheets();
    }
    if (publicSheets) {
      getAllPublicSheets();
    }
  }, [getAllMySheets, getAllPublicSheets]);
  return (
    <div className="min-h-screen bg-craft-bg">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-craft-text-primary mb-2">
              Problem Sheets
            </h1>
            <p className="text-craft-text-secondary">
              Curated collections of problems for focused practice
            </p>
          </div>
          <Link to={"/sheets/create"}>
            <Button className="bg-craft-accent hover:bg-craft-accent/80 text-craft-bg">
              <Plus className="w-4 h-4 mr-2" />
              Create Sheet
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="my-sheets" className="w-full">
          <TabsList className="bg-craft-panel border border-craft-border mb-8">
            <TabsTrigger
              value="my-sheets"
              className="data-[state=active]:bg-craft-accent data-[state=active]:text-craft-bg"
            >
              My Sheets
            </TabsTrigger>
            <TabsTrigger
              value="public-sheets"
              className="data-[state=active]:bg-craft-accent data-[state=active]:text-craft-bg"
            >
              <Users className="w-4 h-4 mr-2" />
              Public Sheets
            </TabsTrigger>
          </TabsList>

          {isGettingSheets ? (
            "Loading..."
          ) : (
            <TabsContent value="my-sheets">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {mySheets.map((sheet) => {
                  return (
                    <div className="h-full">
                      <SheetCard key={sheet.id} sheet={sheet} isOwned={true} />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}

          {isGettingSheets ? (
            "Loading..."
          ) : (
            <TabsContent value="public-sheets">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {publicSheets.map((sheet) => {
                  return (
                    <div className="h-full">
                      <SheetCard key={sheet.id} sheet={sheet} isOwned={false} />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SheetsPage;
