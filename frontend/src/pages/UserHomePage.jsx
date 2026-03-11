import AssistantExperienceSection from "../components/user/AssistantExperienceSection";
import ChatWidget from "../components/user/ChatWidget";
import FeaturesSection from "../components/user/FeaturesSection";
import HelpSection from "../components/user/HelpSection";
import HeroSection from "../components/user/HeroSection";
import TopicsSection from "../components/user/TopicsSection";

export default function UserHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSection />
      <FeaturesSection />
      <TopicsSection />
      <AssistantExperienceSection />
      <HelpSection />
      <ChatWidget />
    </div>
  );
}

