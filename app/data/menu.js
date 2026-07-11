import {
  IconLayoutDashboardFilled,
  IconUserFilled,
  IconDatabaseFilled,
  IconUsers,
  IconHistory,
  IconClockCheck,
} from "@tabler/icons-vue";

export const menuItems = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboardFilled,
    to: "/",
    roles: ["SUPER_ADMIN", "MANAGER_HRD", "ADMIN_HRD"],
  },

  {
    title: "Data Pegawai",
    icon: IconUserFilled,
    to: "/pegawai",
    roles: ["MANAGER_HRD", "ADMIN_HRD"],
  },

  {
    title: "Absensi",
    icon: IconClockCheck,
    to: "/absensi",
    roles: ["MANAGER_HRD", "ADMIN_HRD"],
  },

  {
    title: "Tunjangan",
    icon: IconDatabaseFilled,

    roles: ["MANAGER_HRD", "ADMIN_HRD"],

    children: [
      {
        title: "Setting Tunjangan Transport",
        to: "/tunjangan/setting",

        roles: ["ADMIN_HRD"],
      },

      {
        title: "Tunjangan Transport",
        to: "/tunjangan/transport",

        roles: ["MANAGER_HRD", "ADMIN_HRD"],
      },
    ],
  },

  {
    title: "Manajemen User",
    icon: IconUsers,

    roles: ["SUPER_ADMIN"],

    children: [
      {
        title: "Manajemen Role",
        to: "/user/role",

        roles: ["SUPER_ADMIN"],
      },

      {
        title: "Manajemen User",
        to: "/user/manage",

        roles: ["SUPER_ADMIN"],
      },
    ],
  },

  {
    title: "Log Aktifitas",
    icon: IconHistory,
    to: "/log",

    roles: ["SUPER_ADMIN"],
  },
];
