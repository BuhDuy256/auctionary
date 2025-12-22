import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Code2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Member {
  id: string;
  name: string;
  studentId: string;
  major: string;
  education: string;
  bio: string;
  avatar: string;
  avatarDetail: string;
}

const members: Member[] = [
  {
    id: "luan",
    name: "Tran Nguyen Khai Luan",
    studentId: "23127006",
    major: "Software Engineering",
    education: "University of Science - VNUHCM",
    bio: "Software Engineering student passionate about developing web applications and exploring new technologies.",
    avatar: "/assets/luan.jpg",
    avatarDetail: "/assets/luan_about_me.png",
  },
  {
    id: "duy",
    name: "Nguyen Bao Duy",
    studentId: "23127179",
    major: "Software Engineering",
    education: "University of Science - VNUHCM",
    bio: "A passionate Software Engineering student who loves exploring technology and building meaningful projects.",
    avatar: "/assets/duy.jpg",
    avatarDetail: "/assets/duy_about_me.jpg",
  },
];

export default function MemberIntroductionPage() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02ek00OCAzNmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZjk5MDAiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              className="mb-4 border-accent/50 bg-accent/10 text-accent"
              variant="outline"
            >
              <Code2 className="mr-1 h-3 w-3" />
              Team Brotocol
            </Badge>
            <h1 className="text-5xl mb-4">
              Hi, we are <span className="text-accent">Brotocol</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We are passionate software engineering students building
              innovative solutions
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Auctionary
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedMember ? (
          /* Member Cards Grid */
          <section>
            <h2 className="text-3xl text-center mb-8">Meet Our Members</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-accent/50"
                  onClick={() => setSelectedMember(member)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-accent/20 group-hover:border-accent/50 transition-all">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {member.name}
                      </h3>
                      <Badge variant="outline" className="mb-4">
                        {member.studentId}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          /* Member Detail View */
          <section className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedMember(null)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-8 border-b border-border">
                  <h1 className="text-4xl mb-2 text-center">ABOUT ME</h1>
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-accent/20">
                        <img
                          src={selectedMember.avatarDetail}
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                      <p className="text-lg">
                        <strong className="text-accent">
                          {selectedMember.name}
                        </strong>{" "}
                        — {selectedMember.bio}
                      </p>

                      <div className="space-y-2 text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">
                            Student ID:
                          </Badge>
                          <span>{selectedMember.studentId}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">
                            Major:
                          </Badge>
                          <span>{selectedMember.major}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">
                            Education:
                          </Badge>
                          <span>{selectedMember.education}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 23127006 - 23127179
          </p>
        </div>
      </footer>
    </div>
  );
}
