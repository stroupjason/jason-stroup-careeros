import { PageHero, RoleCard, SectionHeader } from "../components/UI";
import { roleLenses } from "../data/site";

const groups = ["Immediate", "Bridge", "Long-term", "Exploratory"] as const;

const groupCopy = {
  Immediate:
    "Roles that can credibly use the strongest evidence already present today.",
  Bridge:
    "The engineering transition that requires focused proof through code, tests, review, and deployment.",
  "Long-term":
    "The role where customer engineering, delivery, data, and business value converge.",
  Exploratory:
    "A real area of interest with early evidence, but not a primary job-search claim today.",
};

export function RolesPage() {
  return (
    <>
      <PageHero
        eyebrow="Recruiter role lenses"
        title="One professional identity. Different evidence ordering."
        copy="The breadth is useful only when the site remains honest about priority and maturity. These pages do not present seven unrelated careers; they show how one hybrid technical background transfers."
      />
      {groups.map((group) => {
        const roles = roleLenses.filter((role) => role.group === group);
        return (
          <section className={group === "Bridge" ? "section band" : "section shell"} key={group}>
            <div className={group === "Bridge" ? "shell" : undefined}>
              <SectionHeader
                kicker={`${group} lenses`}
                title={group}
                copy={groupCopy[group]}
              />
              <div className="roleGrid">
                {roles.map((role) => (
                  <RoleCard key={role.slug} role={role} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
