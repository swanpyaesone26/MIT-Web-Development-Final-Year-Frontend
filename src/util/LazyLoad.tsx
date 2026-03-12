import { Suspense, type ComponentProps, type ElementType } from "react";

type LazyLoadProps<T extends ElementType>=({
    Component : ElementType
} & ComponentProps<T>)

const LazyLoad = <T extends ElementType>({
    component: Component,
    ...props
} : LazyLoadProps<T>) =>{
    return (
        <Suspense fallback={<div>Loading....</div>}>
            <Component {...props}/>
        </Suspense>
    )
}

export default LazyLoad