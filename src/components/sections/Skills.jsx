import { RevealOnScroll } from "../RevealOnScroll";
import { skillGroups } from "../../data/resume";
import { getSkillIcon, monogramFor } from "../../data/skillIcons";

/**
 * Compact skill tile: small dark rounded square + brand-colored icon, with
 * the skill name in a tiny label underneath. Falls back to a 1–2 char
 * monogram tile when no brand icon is mapped (keeps the grid uniform).
 */
function SkillTile({ name }) {
  const entry = getSkillIcon(name);
  const Icon = entry?.Icon || null;
  const color = entry?.color || "#94A3B8";

  return (
    <div
      className="group flex flex-col items-center gap-1 w-[60px]"
      title={name}
    >
      <div
        className="
          relative w-11 h-11 rounded-xl
          bg-gray-900/95 dark:bg-white/[0.04]
          border border-white/5
          flex items-center justify-center
          transition-all duration-200
          group-hover:-translate-y-0.5
        "
        aria-label={name}
      >
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            boxShadow: `0 4px 14px ${color}55, 0 0 0 1px ${color}55 inset`,
          }}
        />
        {Icon ? (
          <Icon
            size={22}
            color={color}
            className="transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          />
        ) : (
          <span
            className="text-[12px] font-bold tracking-tight transition-transform duration-200 group-hover:scale-110"
            style={{ color }}
            aria-hidden="true"
          >
            {monogramFor(name)}
          </span>
        )}
      </div>
      <span className="text-[10px] leading-tight text-center text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors line-clamp-2">
        {name}
      </span>
    </div>
  );
}

export const Skills = () => {
  return (
    <section id="skills" className="py-8 md:py-10 flex justify-center">
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center mb-5">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
              Skills & Toolbox
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Day-to-day stack across services, data, ML, and infra
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] divide-y divide-black/5 dark:divide-white/5">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 px-4 sm:px-5 py-3 sm:py-4"
              >
                <h3 className="shrink-0 sm:w-40 text-[11px] font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:pt-2">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-3">
                  {group.items.map((tech) => (
                    <SkillTile key={tech} name={tech} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
