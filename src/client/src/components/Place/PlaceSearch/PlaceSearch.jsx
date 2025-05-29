// import styles from './PlaceSearch.module.css';

// import { useEffect, useState, useLayoutEffect, useRef, useContext } from 'react';

// import { SearchOutlined, AppstoreOutlined, TagsOutlined, GlobalOutlined } from '@ant-design/icons';
// import {
//     Input,
//     Select,
//     Card,
//     Spin,
//     Pagination,
//     ConfigProvider,
//     Cascader,
//     Empty
// } from 'antd';

// import { vibesServiceFactory } from '../../../services/vibesService';
// import { placesServiceFactory } from '../../../services/placesService';
// import { countriesServiceFactory } from '../../../services/countriesService';
// import { categoriesServiceFactory } from '../../../services/categoriesService';

// import { useDebounce } from 'use-debounce';

// import PlacesList from '../PlacesList/PlacesList';

// import { fireError } from '../../../utils/fireError';
// import { mapCategoriesOptions, mapCountryOptions, mapTagsOptions } from '../UploadPlace/uploadPlaceUtil';

// import { AuthContext } from '../../../contexts/AuthContext';

// const PlaceSearch = () => {

//     const { token } = useContext(AuthContext);

//     const searchContext = 'global';

//     // Services
//     const vibesService = vibesServiceFactory();
//     const placesService = placesServiceFactory(token);
//     const countriesService = countriesServiceFactory();
//     const categoriesService = categoriesServiceFactory();

//     const resultsRef = useRef(null);

//     const [places, setPlaces] = useState([]);

//     // Place name state
//     const [placeName, setPlaceName] = useState('');
//     const [debouncedPlaceName] = useDebounce(placeName, 700);

//     // pagination
//     const [pagesCount, setPagesCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);

//     const [isLoading, setIsLoading] = useState(false);

//     // category state
//     const [categoryOptions, setCategoryOptions] = useState([]);
//     const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);

//     // Country state
//     const [countryOptions, setCountryOptions] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState(null);
//     const [countrySearch, setCountrySearch] = useState('');
//     const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
//     const [countryLoading, setCountryLoading] = useState(false);
//     const [debouncedCountrySearch] = useDebounce(countrySearch, 500);

//     // tags state
//     const [tags, setTags] = useState([]);
//     const [selectedTagIds, setSelectedTagIds] = useState([]);

//     useEffect(() => {

//         const fetchPlaces = async () => {

//             setIsLoading(true);

//             try {
//                 const params = new URLSearchParams({
//                     context: searchContext,
//                     name: debouncedPlaceName,
//                     page: currentPage
//                 });

//                 if (selectedCategoryPath?.length === 2) {
//                     params.append('categoryId', selectedCategoryPath[0]);
//                     params.append('subcategoryId', selectedCategoryPath[1]);
//                 } else if (selectedCategoryPath?.length === 1) {
//                     params.append('categoryId', selectedCategoryPath[0]);
//                 }

//                 if (selectedCountryId) {
//                     params.append('countryId', selectedCountryId);
//                 }

//                 if (selectedTagIds.length > 0) {
//                     selectedTagIds.forEach(tagId => params.append('tags', tagId));
//                 }

//                 const res = await placesService.searchPlace(params.toString());

//                 setPlaces(res.places);
//                 setPagesCount(res.pagination.pagesCount);
//             } catch (err) {
//                 fireError(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchPlaces();

//     },
//         [
//             debouncedPlaceName,
//             currentPage,
//             selectedCategoryPath,
//             selectedCountryId,
//             selectedTagIds,
//         ]);

//     useEffect(() => {

//         if (!debouncedCountrySearch) {
//             setCountryOptions([]);
//             return;
//         }

//         setCountryLoading(true);

//         countriesService
//             .getCountries(debouncedCountrySearch)
//             .then(res => {
//                 const options = mapCountryOptions(res);
//                 setCountryOptions(options);
//             })
//             .catch(fireError)
//             .finally(() => setCountryLoading(false));
//     }, [debouncedCountrySearch]);


//     useEffect(() => {

//         categoriesService
//             .getCategoriesOptions()
//             .then(res => {
//                 const options = mapCategoriesOptions(res);
//                 setCategoryOptions(options);
//             }).catch(err => fireError(err));

//         vibesService
//             .getVibes()
//             .then(res => setTags(mapTagsOptions(res)))
//             .catch(err => fireError(err));

//     }, []);

//     const handlePageChange = (page) => setCurrentPage(page);

//     const handleTagChange = (value) => {
//         setSelectedTagIds(value);
//     }

//     return (
//         <>
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 marginTop: '1.5rem',
//             }}>
//                 <Card
//                     title={
//                         <div style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '0.75rem',
//                             fontSize: '1.3rem',
//                             fontWeight: 600,
//                             color: '#fff',
//                         }}>
//                             <SearchOutlined style={{ fontSize: '1.5rem' }} />
//                             Search Places
//                         </div>
//                     }
//                     styles={{
//                         header: {
//                             background: 'linear-gradient(90deg, #52c41a 0%, #36cfc9 100%)',
//                             borderTopLeftRadius: '1rem',
//                             borderTopRightRadius: '1rem',
//                             padding: '1.2rem 1.5rem',
//                         },
//                         body: {
//                             padding: '2rem',
//                             backgroundColor: '#fdfefc',
//                             borderBottomLeftRadius: '1rem',
//                             borderBottomRightRadius: '1rem',
//                         }
//                     }}
//                     style={{
//                         width: '70%',
//                         boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
//                         borderRadius: '1rem',
//                         border: 'none'
//                     }}
//                 >
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
//                         <Input
//                             allowClear
//                             size="large"
//                             placeholder="Start typing place name..."
//                             prefix={<SearchOutlined style={{ color: '#52c41a' }} />}
//                             value={placeName}
//                             onChange={(e) => {
//                                 setPlaceName(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                         />

//                         <Cascader
//                             prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
//                             options={categoryOptions}
//                             onChange={(value) => {
//                                 setSelectedCategoryPath(value);
//                                 setCurrentPage(1);
//                             }}
//                             value={selectedCategoryPath}
//                             placeholder="Select category and subcategory"
//                             allowClear
//                             style={{ width: '100%' }}
//                             changeOnSelect
//                             expandTrigger="hover"
//                         />

//                         <Select
//                             prefix={<GlobalOutlined style={{ color: '#52c41a' }} />}
//                             size='large'
//                             showSearch
//                             allowClear
//                             placeholder="Start typing and select a country..."
//                             optionFilterProp="label"
//                             style={{ width: '100%' }}
//                             value={selectedCountryId}
//                             onSearch={(value) => {
//                                 setCountrySearch(value);
//                                 setOpenCountryDropdown(true);
//                                 if (value.trim() === '') {
//                                     setCountryLoading(false);
//                                     setCountryOptions([]);
//                                 } else {
//                                     setCountryLoading(true);
//                                 }

//                             }}
//                             onChange={(value) => {
//                                 setSelectedCountryId(value);
//                                 setCurrentPage(1);
//                             }}
//                             onBlur={() => {
//                                 setCountryOptions([]);
//                                 setOpenCountryDropdown(false);
//                             }}
//                             open={openCountryDropdown}
//                             onOpenChange={(open) => {
//                                 if (!countryLoading) setOpenCountryDropdown(open);
//                             }}
//                             notFoundContent={
//                                 countryLoading ? (
//                                     <div style={{ padding: '2rem 0', textAlign: 'center' }}>
//                                         <ConfigProvider
//                                             theme={{
//                                                 components: {
//                                                     Spin: { colorPrimary: 'green' }
//                                                 }
//                                             }}
//                                         >
//                                             <Spin size="large" />
//                                         </ConfigProvider>
//                                     </div>
//                                 ) : <Empty />
//                             }
//                             options={countryOptions}
//                         />

//                         <ConfigProvider
//                             theme={{
//                                 components: {
//                                     Select: {
//                                         optionActiveBg: '#ecfffb',
//                                         optionSelectedBg: '#d6f5e3',
//                                         optionSelectedColor: '#1a3d2f',
//                                     }
//                                 }
//                             }}
//                         >
//                             <Select
//                                 prefix={<TagsOutlined style={{ color: '#52c41a' }} />}
//                                 mode="multiple"
//                                 style={{ width: '100%', textAlign: 'left' }}
//                                 placeholder="Select Tags"
//                                 // onChange={handleTagChange}
//                                 onChange={(value) => {
//                                     if (value.length <= 20) {
//                                         handleTagChange(value);
//                                     } else {
//                                         // Optionally: give user feedback (e.g., notification)
//                                     }
//                                 }}
//                                 options={tags}
//                                 size='large'
//                                 allowClear
//                                 showSearch
//                                 optionFilterProp="label"
//                                 value={selectedTagIds}
//                             />

//                         </ConfigProvider>

//                     </div>
//                 </Card>

//             </div>

//             <div ref={resultsRef} className={styles.scrollTarget} style={{ minHeight: '500px' }}>
//                 {isLoading ?
//                     (
//                         <div style={{ width: '100%', marginTop: '3rem', textAlign: 'center' }}>
//                             <ConfigProvider
//                                 theme={{
//                                     components: { Spin: { colorPrimary: 'green' } },
//                                 }}
//                             >
//                                 <Spin size="large" />
//                             </ConfigProvider>
//                         </div>
//                     ) :
//                     (
//                         <>
//                             {
//                                 places.length === 0 ?
//                                     (
//                                         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
//                                             <Card
//                                                 style={{
//                                                     maxWidth: 600,
//                                                     width: '100%',
//                                                     textAlign: 'center',
//                                                     boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
//                                                     borderRadius: '1rem',
//                                                     padding: '2rem'
//                                                 }}
//                                             >
//                                                 <h2>No places found</h2>
//                                                 <p style={{ color: '#888' }}>
//                                                     We couldn't find any places matching your search.
//                                                 </p>
//                                             </Card>
//                                         </div>
//                                     ) :
//                                     (
//                                         <PlacesList places={places} isForAdmin={false} />
//                                     )
//                             }

//                             {
//                                 pagesCount > 1 &&
//                                 !isLoading &&
//                                 (
//                                     <ConfigProvider
//                                         theme={{
//                                             components: {
//                                                 Pagination: {
//                                                     itemActiveBg: '#e8fffb',
//                                                     itemActiveColor: '#52c41a',
//                                                     colorPrimary: '#52c41a',
//                                                     colorPrimaryHover: '#389e0d',
//                                                 },
//                                             },
//                                         }}
//                                     >
//                                         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
//                                             <Pagination
//                                                 current={currentPage}
//                                                 onChange={handlePageChange}
//                                                 total={pagesCount * 6}
//                                                 pageSize={6}
//                                                 showSizeChanger={false}
//                                             />
//                                         </div>
//                                     </ConfigProvider>
//                                 )
//                             }
//                         </>
//                     )}
//             </div>
//         </>
//     );

// };

// export default PlaceSearch;

import PlacesWithSearchPage from "../PlacesWithSearchPage/PlacesWithSearchPage";

const PlaceSearch = () => {
    return <PlacesWithSearchPage isForAdmin={false} searchContext="global" />
};

export default PlaceSearch;
