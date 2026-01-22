import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Bot, Store, Heart, AlertTriangle, TrendingUp, MapPin, ThermometerSun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalinityMap } from "@/components/SalinityMap";
import heroImage from "@/assets/hero-mekong.jpg";
import farmerImage from "@/assets/farmer-checking.jpg";

const salinityAlerts = [
  { location: "Bến Tre - Bình Đại", level: 5.2 },
  { location: "Trà Vinh - Cầu Ngang", level: 4.1 },
  { location: "Sóc Trăng - Mỹ Xuyên", level: 3.5 },
  { location: "Kiên Giang - An Biên", level: 2.8 },
];

export default function Index() {
  const { t } = useLanguage();

  const getStatus = (level: number) => {
    if (level > 7) return "danger";
    if (level >= 4) return "warning";
    return "safe";
  };

  const currentAlerts = salinityAlerts.map(alert => ({
    ...alert,
    status: getStatus(alert.level)
  }));

  const quickStats = [
    { label: t("stats.farmers"), value: "12,500+", icon: TrendingUp },
    { label: t("stats.diagnosis"), value: "45,000+", icon: Bot },
    { label: t("stats.provinces"), value: "13", icon: MapPin },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
        </div>

        <div className="container relative z-10 py-12 md:py-20">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-secondary text-secondary-foreground border-2 border-foreground px-4 py-1">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              {t("hero.title")}
              <br />
              <span className="text-secondary">{t("hero.subtitle")}</span>
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t("hero.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/diagnosis">
                <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md hover:shadow-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <Bot className="mr-2 h-5 w-5" />
                  {t("hero.cta.diagnosis")}
                </Button>
              </Link>
              <Link to="/taccau">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground hover:bg-primary-foreground/20">
                  <Store className="mr-2 h-5 w-5" />
                  {t("hero.cta.taccau")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-b-2 border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-2 border-border bg-background">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salinity Map & Alerts */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-accent bg-accent">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("alerts.title")}</h2>
              <p className="text-muted-foreground">{t("alerts.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salinity Map */}
            <SalinityMap />

            {/* Alert Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentAlerts.map((alert, index) => (
                <Card
                  key={index}
                  className={`border-2 ${alert.status === 'danger'
                      ? 'border-destructive'
                      : alert.status === 'warning'
                        ? 'border-accent'
                        : 'border-green-600'
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{alert.location}</p>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-muted-foreground" />
                          <span
                            className={`text-2xl font-bold ${alert.status === 'danger'
                                ? 'text-destructive'
                                : alert.status === 'warning'
                                  ? 'text-accent'
                                  : 'text-green-600'
                              }`}
                          >
                            {alert.level}g/L
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`border-2 border-foreground ${alert.status === 'danger'
                            ? 'bg-destructive text-destructive-foreground'
                            : alert.status === 'warning'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-green-100 text-green-700 hover:bg-green-100' // Using built-in colors for safe
                          }`}
                      >
                        {
                          alert.status === 'danger' ? t("alerts.danger") :
                            alert.status === 'warning' ? t("alerts.warning") :
                              t("alerts.safe")
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("features.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/diagnosis">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary mb-4 group-hover:bg-secondary group-hover:border-secondary transition-colors">
                    <Bot className="h-7 w-7 text-primary-foreground group-hover:text-secondary-foreground" />
                  </div>
                  <CardTitle>{t("features.diagnosis.title")}</CardTitle>
                  <CardDescription>
                    {t("features.diagnosis.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/taccau">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-secondary bg-secondary mb-4 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Store className="h-7 w-7 text-secondary-foreground group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>{t("features.taccau.title")}</CardTitle>
                  <CardDescription>
                    {t("features.taccau.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/community">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-accent bg-accent mb-4 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Heart className="h-7 w-7 text-accent-foreground group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>{t("features.community.title")}</CardTitle>
                  <CardDescription>
                    {t("features.community.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/marketplace">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-muted mb-4 group-hover:bg-primary transition-colors">
                    <ThermometerSun className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>{t("features.marketplace.title")}</CardTitle>
                  <CardDescription>
                    {t("features.marketplace.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary-foreground">
                {t("cta.title")}
              </h2>
              <p className="text-primary-foreground/90">
                {t("cta.description")}
              </p>
              <Link to="/diagnosis">
                <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
                  <Droplets className="mr-2 h-5 w-5" />
                  {t("cta.button")}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={farmerImage}
                alt="Farmer checking salinity"
                className="border-4 border-primary-foreground shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
