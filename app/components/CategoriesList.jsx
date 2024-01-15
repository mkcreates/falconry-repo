// modules
import Link from 'next/link'
import { useGlobalContext } from '@/lib/globalContext'

// icons
import { DotOutline } from '@phosphor-icons/react/dist/ssr'

const CategoriesList = ({ closer }) => {
    const { categories } = useGlobalContext()

    return (
        <div className='navList w-full'>
            {categories.map((cat, index) => (
                <Link
                    href={'/?cat='+cat._id}
                    key={index}
                    prefetch={false}
                    onClick={() => closer(false)}
                >
                    <DotOutline size={20} />
                    <div>{cat.name}</div>
                </Link>
            ))}
        </div>
    )
}
 
export default CategoriesList