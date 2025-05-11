import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from 'lucide';

const bankingIcons = {
  // 🏦 Banque & comptes
  Bank: icons.Building2,
  CreditCard: icons.CreditCard,
  Wallet: icons.Wallet,
  DollarSign: icons.DollarSign,
  Coins: icons.Coins,
  PiggyBank: icons.PiggyBank,
  Briefcase: icons.Briefcase,
  Key: icons.Key,

  // 📤 Transferts & paiements
  Send: icons.Send,
  ArrowDownCircle: icons.ArrowDownCircle,
  ArrowUpCircle: icons.ArrowUpCircle,
  Repeat: icons.Repeat,
  Receipt: icons.Receipt,
  Barcode: icons.Barcode,
  QRCode: icons.QrCode,

  // 💳 Cartes
  Scan: icons.Scan,
  Radio: icons.Radio,

  // 📊 Analytics / Business
  BarChart2: icons.BarChart2,
  PieChart: icons.PieChart,
  LineChart: icons.LineChart,
  TrendingUp: icons.TrendingUp,
  TrendingDown: icons.TrendingDown,

  // 👤 Utilisateurs
  User: icons.User,
  Users: icons.Users,
  UserCheck: icons.UserCheck,
  UserPlus: icons.UserPlus,
  UserCog: icons.UserCog,
  UserMinus: icons.UserMinus,

  // 🔔 Notifications
  Bell: icons.Bell,
  BellRing: icons.BellRing,
  BellOff: icons.BellOff,

  // 📁 Documents & contrats
  FileText: icons.FileText,
  FileCheck: icons.FileCheck,
  FileX: icons.FileX,
  FilePlus: icons.FilePlus,
  ClipboardList: icons.ClipboardList,
  Folder: icons.Folder,

  // 🔐 Sécurité & authentification
  Lock: icons.Lock,
  Unlock: icons.Unlock,
  ShieldCheck: icons.ShieldCheck,
  Fingerprint: icons.Fingerprint,
  KeyRound: icons.KeyRound,
  ScanFace: icons.ScanFace,
  Eye: icons.Eye,
  EyeOff: icons.EyeOff,

  // ⚙️ Paramètres & support
  Settings: icons.Settings,
  HelpCircle: icons.HelpCircle,
  Info: icons.Info,
  AlertTriangle: icons.AlertTriangle,
  LifeBuoy: icons.LifeBuoy,
  Phone: icons.Phone,
  Mail: icons.Mail,
  MapPin: icons.MapPin,
  Globe: icons.Globe,

  // 🧭 Navigation & dashboard
  Home: icons.Home,
  LayoutDashboard: icons.LayoutDashboard,
  Menu: icons.Menu,
  ChevronRight: icons.ChevronRight,
  ArrowLeft: icons.ArrowLeft,
  ArrowRight: icons.ArrowRight,

  // ✏️ Actions générales
  Plus: icons.Plus,
  Edit: icons.Edit,
  Trash2: icons.Trash2,
  Download: icons.Download,
  Upload: icons.Upload,
  RefreshCw: icons.RefreshCw,
  Filter: icons.Filter,
  Search: icons.Search,
  MoreVertical: icons.MoreVertical,
  Check: icons.Check,
  X: icons.X,
  ExternalLink: icons.ExternalLink,
  LogOut: icons.LogOut,
  Twitter: icons.Twitter,
  Github: icons.Github,
  Linkedin: icons.Linkedin,
};

@NgModule({
  imports: [LucideAngularModule.pick(bankingIcons)],
  exports: [LucideAngularModule]
})
export class BankingLucideIconsModule {}
