import { HomeHero } from "../components/HomeHero";
import { useHomeCatalog } from "../hooks/useHomeCatalog";



const HomePage = () => {

    const {
        products,
        categories,
        categoryChipsLoading,
        categoryFilter,
        error,
        loadingCategories,
        loadingList,
        setCategory,
    } = useHomeCatalog();

  return (
    <div className="space-y-12">
        <HomeHero categories={categories} loadingCategories={loadingCategories} />
    </div>
  )
}

export default HomePage;