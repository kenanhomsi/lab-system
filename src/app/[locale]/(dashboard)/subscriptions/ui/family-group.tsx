import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";

export function FamilyGroup() {
  const t = useTranslations("subscriptions");

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-slate-100/50 bg-surface-container-lowest p-8 shadow-sm dark:border-slate-800">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="font-headline text-lg font-bold">{t("familyTitle")}</h4>
        <Icon name="person_add" className="cursor-pointer text-primary" size="sm" />
      </div>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center space-x-3 rounded-2xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed font-bold text-primary">
            SA
          </div>
          <div>
            <p className="text-sm font-semibold">Sarah Al-Mutawali</p>
            <p className="text-[11px] font-medium text-slate-500">
              {t("primary")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 rounded-2xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed font-bold text-secondary">
            JA
          </div>
          <div>
            <p className="text-sm font-semibold">James Al-Mutawali</p>
            <p className="text-[11px] font-medium text-slate-500">{t("dependent")}</p>
          </div>
        </div>
        <button
          type="button"
          className="group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-6 transition-colors hover:border-primary dark:border-slate-700"
        >
          <span className="text-sm font-medium text-slate-400 group-hover:text-primary">
            {t("addNewMember")}
          </span>
        </button>
      </div>
    </div>
  );
}
