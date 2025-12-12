import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  FolderTree,
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit,
  GripVertical,
  Package,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: Category[];
  expanded?: boolean;
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    count: 342,
    expanded: true,
    subcategories: [
      { id: "1-1", name: "Cameras", count: 87 },
      { id: "1-2", name: "Laptops", count: 124 },
      { id: "1-3", name: "Phones", count: 98 },
      { id: "1-4", name: "Audio Equipment", count: 33 },
    ],
  },
  {
    id: "2",
    name: "Fashion",
    count: 256,
    expanded: false,
    subcategories: [
      { id: "2-1", name: "Watches", count: 67 },
      { id: "2-2", name: "Handbags", count: 89 },
      { id: "2-3", name: "Sneakers", count: 100 },
    ],
  },
  {
    id: "3",
    name: "Collectibles",
    count: 189,
    expanded: false,
    subcategories: [
      { id: "3-1", name: "Coins", count: 45 },
      { id: "3-2", name: "Cards", count: 78 },
      { id: "3-3", name: "Vintage Toys", count: 66 },
    ],
  },
  {
    id: "4",
    name: "Art",
    count: 134,
    expanded: false,
    subcategories: [
      { id: "4-1", name: "Paintings", count: 56 },
      { id: "4-2", name: "Sculptures", count: 34 },
      { id: "4-3", name: "Photography", count: 44 },
    ],
  },
  {
    id: "5",
    name: "Vehicles",
    count: 98,
    expanded: false,
    subcategories: [
      { id: "5-1", name: "Cars", count: 45 },
      { id: "5-2", name: "Motorcycles", count: 23 },
      { id: "5-3", name: "Boats", count: 30 },
    ],
  },
];

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState("");

  const toggleExpanded = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `new-${Date.now()}`,
      name: newCategoryName,
      count: 0,
      subcategories: [],
    };

    if (newCategoryParent) {
      // Add as subcategory
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === newCategoryParent) {
            return {
              ...cat,
              subcategories: [...(cat.subcategories || []), newCategory],
            };
          }
          return cat;
        })
      );
    } else {
      // Add as main category
      setCategories((prev) => [...prev, newCategory]);
    }

    toast.success("Category added successfully!");
    setNewCategoryName("");
    setNewCategoryParent("");
    setAddDialogOpen(false);
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategories((prev) => {
      // Remove from main categories
      const filtered = prev.filter((cat) => cat.id !== categoryId);

      // Remove from subcategories
      return filtered.map((cat) => ({
        ...cat,
        subcategories: cat.subcategories?.filter(
          (sub) => sub.id !== categoryId
        ),
      }));
    });

    toast.success(`Category "${categoryName}" deleted successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2">Category Management</h1>
          <p className="text-sm text-muted-foreground">
            Organize and manage auction categories
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category or subcategory for organizing auctions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Smartphones"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">
                  Parent Category (Optional)
                </Label>
                <select
                  id="parentCategory"
                  value={newCategoryParent}
                  onChange={(e) => setNewCategoryParent(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
                >
                  <option value="">None (Main Category)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} className="flex-1">
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{categories.length}</div>
                <div className="text-xs text-muted-foreground">
                  Main Categories
                </div>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <FolderTree className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {categories.reduce(
                    (sum, cat) => sum + (cat.subcategories?.length || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Subcategories
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <FolderTree className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Auctions
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <Package className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">
                  {Math.round(
                    categories.reduce((sum, cat) => sum + cat.count, 0) /
                      categories.length
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg per Category
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tree */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Category Tree</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Main Category */}
                <div className="group hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(category.id)}
                        className="h-6 w-6 p-0"
                      >
                        {category.expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>

                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                        <FolderTree className="h-4 w-4 text-accent" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{category.name}</span>
                          <Badge className="bg-secondary text-foreground border-border text-xs">
                            {category.subcategories?.length || 0} subcategories
                          </Badge>
                        </div>
                      </div>

                      <Badge className="bg-accent/20 text-accent border-accent/50">
                        {category.count} auctions
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-red-500/30">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"?
                              This will also delete all{" "}
                              {category.subcategories?.length || 0}{" "}
                              subcategories and affect {category.count}{" "}
                              auctions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteCategory(category.id, category.name)
                              }
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {category.expanded && category.subcategories && (
                  <div className="bg-secondary/20">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="group hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between p-4 pl-16">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                              <FolderTree className="h-3 w-3 text-blue-500" />
                            </div>

                            <span className="text-sm">{sub.name}</span>

                            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50 text-xs">
                              {sub.count} auctions
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-red-500/30">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Subcategory
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{sub.name}
                                    "? This will affect {sub.count} auctions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteCategory(sub.id, sub.name)
                                    }
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
