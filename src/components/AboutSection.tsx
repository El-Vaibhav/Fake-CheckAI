import { User, Code, Brain, Database, Sparkles } from "lucide-react";

const skills = [
  { name: "Machine Learning", icon: Brain },
  { name: "Natural Language Processing", icon: Sparkles },
  { name: "Data Science", icon: Database },
  { name: "Python Development", icon: Code },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-primary to-accent p-1">
                  <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center">
                    <User className="w-16 h-16 lg:w-20 lg:h-20 text-muted-foreground" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-success flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-success-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Vaibhav</h2>
                <p className="text-muted-foreground mb-4">ML Engineer & Data Scientist</p>

                {/* Skill Tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-lg"
                    >
                      <skill.icon className="w-4 h-4" />
                      {skill.name}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  This project explores classical machine learning techniques to combat misinformation 
                  in the digital age. By leveraging TF-IDF vectorization and ensemble learning methods, 
                  we've developed a robust system for detecting fake news with high accuracy.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  The goal is to contribute to the fight against misinformation while demonstrating 
                  the practical applications of natural language processing and machine learning 
                  in solving real-world problems.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                  {[
                    { value: "5+", label: "ML Models" },
                    { value: "68K+", label: "Articles Trained" },
                    { value: "95%+", label: "Accuracy" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl lg:text-2xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
